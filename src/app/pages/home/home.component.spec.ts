import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { of } from 'rxjs';
import { DOCUMENT } from '@angular/common';

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

const bookServiceMock = {
  getBooks: () => of(listBook)
};

@Pipe({name: 'reduceText'})
class ReducePipeMock implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return '';
  }
}

describe('Home Component', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        HomeComponent,
        ReducePipeMock
      ],
      providers: [
        // BookService
        {
          provide: BookService,
          useValue: bookServiceMock
        },
        {
          provide: Document,
          useExisting: DOCUMENT
        }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  // prueba de 'subscriptions' en RxJS
  test('getBook get books from the subscription', () => {
    // const bookService = fixture.debugElement.injector.get(BookService);
    // const spy1 = jest.spyOn(bookService, 'getBooks').mockReturnValueOnce(of(listBook));

    component.getBooks();

    // expect(spy1).toHaveBeenCalledTimes(1);

    expect(component.listBook.length).toBe(3);
    expect(component.listBook).toEqual(listBook);
  });

  test('test alert', () => {
    const documentService = TestBed.inject(Document);
    const windowAngular = documentService.defaultView;
    const spy = jest.spyOn(windowAngular, 'alert').mockImplementation(() => null);
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();

  });

});
