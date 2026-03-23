import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileForm } from './profile-form';
import { vi } from 'vitest';

describe('ProfileForm', () => {
  let component: ProfileForm;
  let fixture: ComponentFixture<ProfileForm>;

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  beforeEach(async () => {
    // Mock global fetch for validateHttp
    vi.stubGlobal('fetch', vi.fn());

    await TestBed.configureTestingModule({
      imports: [ProfileForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.profileForm().invalid()).toBe(true);
  });

  it('should validate password mismatch', () => {
    const form = component.profileForm;
    form.password().value.set('password123');
    form.confirmPassword().value.set('different123');

    expect(form.confirmPassword().invalid()).toBe(true);
    expect(form.confirmPassword().errors()).toContainEqual(expect.objectContaining({ kind: 'passwordMismatch' }));
  });

  it('should validate age (under 18)', () => {
    const form = component.profileForm;
    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    const dateString = tenYearsAgo.toISOString().split('T')[0];

    form.dateOfBirth().value.set(dateString);

    expect(form.dateOfBirth().invalid()).toBe(true);
    expect(form.dateOfBirth().errors()).toContainEqual(expect.objectContaining({ kind: 'underage' }));
  });

  it('should show error when username is taken', async () => {
    const form = component.profileForm;
    
    // Mock fetch to return a user (meaning the username is taken)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, username: 'Bret' }]),
    } as Response);

    form.userName().value.set('Bret');
    
    // Wait for debounce (400ms) + some extra time for the fetch to complete
    await delay(600);
    
    // Trigger validation and wait for async response
    await fixture.whenStable();
    
    expect(form.userName().invalid()).toBe(true);
    expect(form.userName().errors()).toContainEqual(expect.objectContaining({ kind: 'taken' }));
  });

  it('should be valid when username is available', async () => {
    const form = component.profileForm;
    
    // Mock fetch to return empty array (meaning the username is available)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    form.userName().value.set('NewUser');
    
    await delay(600);
    await fixture.whenStable();
    
    expect(form.userName().invalid()).toBe(false);
  });

  it('should require emergency contact details when enabled', () => {
    const form = component.profileForm;
    
    form.hasEmergencyContact().value.set(true);
    
    expect(form.emergencyContactName().invalid()).toBe(true);
    expect(form.emergencyContactPhone().invalid()).toBe(true);
    
    form.emergencyContactName().value.set('John Doe');
    form.emergencyContactPhone().value.set('1234567890');
    
    expect(form.emergencyContactName().invalid()).toBe(false);
    expect(form.emergencyContactPhone().invalid()).toBe(false);
  });
});