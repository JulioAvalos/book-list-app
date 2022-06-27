import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public listCartBook: Book[] = [];
  public totalPrice = 0;
  public Math = Math;

  constructor(
    private readonly bookService: BookService,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.listCartBook = this.bookService.getBooksFromCart();
    this.totalPrice = this.getTotalPrice(this.listCartBook);
  }

  public getTotalPrice(listCartBook: Book[]): number {
    let totalPrice = 0;
    listCartBook.forEach((book: Book) => {
      totalPrice += book.amount * book.price;
    });
    return totalPrice;
  }

  public onInputNumberChange(action: string, book: Book): void {
    const amount = action === 'plus' ? book.amount + 1 : book.amount - 1;
    book.amount = Number(amount);
    this.listCartBook = this.bookService.updateAmountBook(book);
    this.totalPrice = this.getTotalPrice(this.listCartBook);
  }


  public onClearBooks(): void {
    if (this.listCartBook?.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: '¿Estás seguro?',
          message: 'Desea eliminar todos los productos del carrito?',
        }
      });

      dialogRef.afterClosed().subscribe((dialogResult: boolean) => {
        if (dialogResult) {
          this.clearListCartBook();
        }
      });

    } else {
      console.log('No books available');[]
    }
  }

  private clearListCartBook() {
    this.listCartBook = [];
    this.bookService.removeBooksFromCart();
  }


}
