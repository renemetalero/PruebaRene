import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpyObj = jasmine.createSpyObj('ProductService', ['getAll', 'delete']);
    
    await TestBed.configureTestingModule({
      declarations: [ ProductsListComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: ProductService, useValue: productServiceSpyObj }
      ]
    })
    .compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get products on initialization', () => {
    const mockProducts = [{ id: '1', name: 'Test Product', description: 'Test Description', logo: 'test.png', date_release: new Date().toISOString(), date_revision: new Date().toISOString() }];
    productServiceSpy.getAll.and.returnValue(of(mockProducts));
    component.ngOnInit();
    expect(productServiceSpy.getAll).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should delete product and update products list', () => {
    const mockProduct = { id: '1', name: 'Test Product', description: 'Test Description', logo: 'test.png', date_release: new Date().toISOString(), date_revision: new Date().toISOString() };
    component.products = [mockProduct];
    productServiceSpy.delete.and.returnValue(of());
    component.delete(mockProduct.id);
    expect(productServiceSpy.delete).toHaveBeenCalledWith(mockProduct.id);
    expect(component.products).toEqual([]);
  });

  it('should set searchValue onSearch', () => {
    const mockSearchValue = 'test';
    component.onSearch(mockSearchValue);
    expect(component.searchValue).toEqual(mockSearchValue);
  });

  it('should navigate to product form on redirectForm', () => {
    spyOn(component.router, 'navigateByUrl');
    component.redirectForm();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/product-form');
  });

  // Add more tests as needed...
});