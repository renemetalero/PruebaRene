import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpyObj = jasmine.createSpyObj('ProductService', ['selected', 'create', 'edit', 'verifyId']);
    
    await TestBed.configureTestingModule({
      declarations: [ ProductFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ProductService, useValue: productServiceSpyObj }
      ]
    })
    .compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
  });

  it('should set form values from selected product', () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date().toISOString(),
      date_revision: new Date().toISOString()
    };
    component.selectedProduct = mockProduct;
    component.setFormvalues();
    expect(component.form.value).toEqual(mockProduct);
  });

  it('should mark form as touched when sendData is called with invalid form', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.sendData();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call productService.create when sendData is called with valid form and no selected product', () => {
    const mockFormValue = { id: '1', name: 'Test', description: 'Test', logo: 'test.png', date_release: new Date().toISOString(), date_revision: new Date().toISOString() };
    component.form.setValue(mockFormValue);
    productServiceSpy.create.and.returnValue(of({}));
    component.sendData();
    expect(productServiceSpy.create).toHaveBeenCalledWith(mockFormValue);
  });

  it('should call productService.edit when sendData is called with valid form and selected product', () => {
    const mockFormValue = { id: '1', name: 'Test', description: 'Test', logo: 'test.png', date_release: new Date().toISOString(), date_revision: new Date().toISOString() };
    component.selectedProduct = { id: '1', name: 'Test', description: 'Test', logo: 'test.png', date_release: new Date().toISOString(), date_revision: new Date().toISOString() };
    component.form.setValue(mockFormValue);
    productServiceSpy.edit.and.returnValue(of({}));
    component.sendData();
    expect(productServiceSpy.edit).toHaveBeenCalledWith(mockFormValue);
  });

  it('should set idTaken error if verifyId returns true', () => {
    const mockId = '1';
    productServiceSpy.verifyId.and.returnValue(of(true));
    component.onValidateId(mockId);
    expect(component.f_id?.hasError('idTaken')).toBeTrue();
  });

  it('should not set idTaken error if verifyId returns false', () => {
    const mockId = '1';
    productServiceSpy.verifyId.and.returnValue(of(false));
    component.onValidateId(mockId);
    expect(component.f_id?.hasError('idTaken')).toBeFalse();
  });

  // Add more tests as needed...
});
