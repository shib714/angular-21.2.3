import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, signal, computed, resource } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop"; 
import { environment } from "../../../environments/env.dev";
import { Film, Vehicle, VehicleResponse } from "./vehicle";
import { map, shareReplay, catchError, Observable, throwError, of } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    private readonly url = environment.VEHICLE_URL;
    protected readonly http: HttpClient = inject(HttpClient);

    // Track vehicle loading error
    vehiclesError = signal<string>('');

    // load vehicles as observable to utilize RxJS operators like shareReplay
    private vehicles$ = this.http.get<VehicleResponse>(this.url).pipe(
        map((data: VehicleResponse) =>
            data.results.map((vehicle) => ({
                ...vehicle,
                cost_in_credits: isNaN(Number(vehicle.cost_in_credits)) ? String(Math.floor(Math.random() * 100000)) : vehicle.cost_in_credits,
            }) as Vehicle)
        ),
        shareReplay(1),
        catchError((err) => {
            this.vehiclesError.set(this.getErrorMessage(err));
            return of([] as Vehicle[]);
        })
    );

    // convert vehicles$ to signal for use in components
    vehicles = toSignal(this.vehicles$, { initialValue: [] as Vehicle[] });

    selectedVehicle = signal<Vehicle | undefined>(undefined);

    // Corrected method name typo
    vehicleSelected(vehicleName: string) {
        const foundVehicle = this.vehicles().find((v: Vehicle) => v.name === vehicleName);
        this.selectedVehicle.set(foundVehicle);
    }

    // Reactive data fetching for films using the Resources API (Angular 19+)
    // In Angular 21, the properties are 'params' and 'loader'
    private filmsResource = resource({
        params: () => this.selectedVehicle(),
        loader: async ({ params: vehicle }) => {
            if (!vehicle || !vehicle.films?.length) return [];
            
            const fetchPromises = vehicle.films.map(link => 
                fetch(link).then(res => res.json() as Promise<Film>)
            );
            return Promise.all(fetchPromises);
        }
    });

    // Computed signals for easy access in templates
    vehicleFilms = computed(() => this.filmsResource.value() ?? []);
    isLoadingFilms = this.filmsResource.isLoading;
    filmsError = this.filmsResource.error;

    /**
     * 
     * @param err Using RxJS
     * 
     vehicleFilms$ = toObservable(this.selectedVehicle).pipe(
        filter(Boolean),
        switchMap((vehicle) =>
            forkJoin(vehicle.films.map((link =>
                this.http.get<Film>(link)))
            )
        )
    );

    vehicleFilms = toSignal<Film[], Film[]>(this.vehicleFilms$, { initialValue: [] });
     */

    private handleError(err: HttpErrorResponse): void {
        console.error(this.getErrorMessage(err));
    }

    private getErrorMessage(err: HttpErrorResponse): string {
        if (err.error instanceof ErrorEvent) {
            return `An error occurred: ${err.error.message}`;
        } else {
            return `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
    }
}
