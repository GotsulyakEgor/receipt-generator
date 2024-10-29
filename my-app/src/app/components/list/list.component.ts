import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Item } from "../../interfaces/item";
import { DataService } from "../../services/data.service";
import { CommonModule, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { Category } from "../../enums/category";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    CommonModule,
    NgOptimizedImage
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  items: Item[] = [];
  coffeeItems: Item[] = [];
  teaItems: Item[] = [];
  reusableItems: Item[] = [];
  availableQuantity: number[] = Array.from({ length: 26 }, (_, i) => i);

  selectedItems: { [id: number]: number } = {};

  @Output() itemsSelected = new EventEmitter<{ item: Item | undefined, quantity: number }[]>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getItems().subscribe((data: Item[]) => {
      this.items = data;
      this.coffeeItems = this.items.filter(item => item.category === Category.Coffee);
      this.teaItems = this.items.filter(item => item.category === Category.Tea);
      this.reusableItems = this.items.filter(item => item.category === Category.ReusableProducts);
    });
  }

  onQuantityChange(itemId: number, event: Event): void {
    const quantity = parseInt((event.target as HTMLSelectElement).value, 10);
    if (quantity === 0) {
      delete this.selectedItems[itemId];
    } else {
      this.selectedItems[itemId] = quantity;
    }
    this.emitSelectedItems();
  }

  private emitSelectedItems(): void {
    const selectedArray = Object.keys(this.selectedItems).map(id => {
      const item = this.items.find(i => i.id === +id);
      return {
        item: item,
        quantity: this.selectedItems[+id]
      };
    });

    this.itemsSelected.emit(selectedArray);
  }


  protected readonly HTMLSelectElement = HTMLSelectElement;
}
