import { CartComponent } from './cart.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from '../../models/book.model';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

const listBook: Book[] = [
  {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 20,
    amount: 1
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 8,
    amount: 7
  }
];

const MatDialogMock = {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
};

describe('Cart component', () => {

  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [
        CartComponent
      ],
      providers: [
        BookService,
        {provide: MatDialog, useValue: MatDialogMock}
        // MatDialog
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(BookService);
    jest.spyOn(service, 'getBooksFromCart').mockImplementation(() => listBook);
  });

  afterEach(() => {
    fixture.destroy();
    jest.resetAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should create', inject([CartComponent], (component2: CartComponent) => {
  //     expect(component2).toBeTruthy();
  // }));

  // metodo con return (regresa un valor)
  test('getTotalPrice returns an amount', () => {
    const totalPrice = component.getTotalPrice(listBook);
    expect(totalPrice).toBeGreaterThan(0);
    // expect(totalPrice).not.toBe(0);
    // expect(totalPrice).not.toBeNull();
  });

  // metodo sin return (regresa un valor)
  test('onInputNumberChange increments correctly', () => {
    const action = 'plus';
    const book: Book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 2
    };

    const spy1 = jest.spyOn(service, 'updateAmountBook').mockImplementation(() => null);
    const spy2 = jest.spyOn(component, 'getTotalPrice').mockImplementation(() => null);

    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);
    expect(book.amount).toBe(3);

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test('onInputNumberChange decrements correctly', () => {
    const action = 'minus';
    const book: Book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 2
    };

    const spy1 = jest.spyOn(service, 'updateAmountBook').mockImplementation(() => null);
    const spy2 = jest.spyOn(component, 'getTotalPrice').mockImplementation(() => null);

    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);
    expect(book.amount).toBe(1);

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test('onClearBooks works correctly', () => {

    const spy1 = jest.spyOn(service, 'removeBooksFromCart').mockImplementation(() => null);
    const spy2 = jest.spyOn(component as any, 'clearListCartBook');

    component.listCartBook = listBook;
    component.onClearBooks();

    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  // alternativa de prueba, no es recomendable aplicarla
  test('clearListCartBook works correctly', () => {
    const spy1 = jest.spyOn(service, 'removeBooksFromCart').mockImplementation(() => null);
    component.listCartBook = listBook;
    component['clearListCartBook']();
    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  test('The title "The cart is empty" is not displayed when there is a list', () => {
    component.listCartBook = listBook;
    fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
    expect(debugElement).toBeFalsy();
  });

  test('The title "The cart is empty" is displayed correctly when the list is empty', () => {
    component.listCartBook = [];
    fixture.detectChanges();
    const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
    expect(debugElement).toBeTruthy();
    if (debugElement) {
      const element: HTMLElement = debugElement.nativeElement;
      expect(element.innerHTML).toContain('The cart is empty');
    }
  });

});
