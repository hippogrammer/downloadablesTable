import {
  AfterViewInit,
  Component,
  OnInit,
  ContentChildren,
  AfterContentInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-downloads-table',
  templateUrl: './downloads-table.component.html',
  styleUrls: ['./downloads-table.component.scss'],
})
export class DownloadsTableComponent implements OnInit {
  _data: any[] = [];
  @Input() set data(d: any[]) {
    this._data = d;
    this.availableCount = d.filter((da) => da.status === 'available').length;
  }
  allSelected = false;
  selectedRows: Map<any, any> = new Map();
  availableCount = 0;
  get data() {
    return this._data;
  }
  constructor() {}

  ngOnInit(): void {}

  isAllSelected(): boolean {
    return false;
  }

  onSelectAllCheckboxClicked() {
    if (this.allSelected) {
      this.allSelected = false;
      this.selectedRows.clear();
      document.querySelectorAll('tr.selected-row').forEach((el) => {
        el.classList.remove('selected-row');
        (
          el.querySelector("input[type='checkbox']") as HTMLInputElement
        ).checked = false;
      });
    } else {
      this.allSelected = true;
      this.data.forEach((d) => {
        let inp = document.getElementById(`${d.name}Input`) as HTMLInputElement;
        if (d.status === 'available') {
          this.selectedRows.set(d.name, d.path);
          inp.checked = true;
          inp?.closest('tr')?.classList.add('selected-row');
        }
      });
    }
  }
  onSelectionChange({ target }: Event) {
    let element = (target as HTMLElement).closest('tr') as HTMLElement;
    if ((element.querySelector('input') as HTMLInputElement).checked) {
      this.selectedRows.set(
        element.querySelector('[data-fileName]')?.getAttribute('data-fileName'),
        {
          path: element.querySelector('[data-path]')?.getAttribute('data-path'),
          device: element
            .querySelector('[data-device]')
            ?.getAttribute('data-device'),
        }
      );
    } else {
      this.selectedRows.delete(
        element.querySelector('[data-fileName]')?.getAttribute('data-fileName')
      );
    }
    this.allSelected = this.selectedRows.size === this.availableCount;
    element.classList.toggle('selected-row');
  }

  onDownloadClicked() {
    let outputString = '';
    this.selectedRows.forEach((values, fileName) => {
      outputString += `
      File Name: ${fileName}
      Device: ${values.device}
      Path: ${values.path}
        -------------------`;
    });
    this.selectedRows.clear();
    document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      (input as HTMLInputElement).checked = false;
      input.closest('tr')?.classList.remove('selected-row');
    });
    console.log(outputString);
    window.alert(outputString);
  }
}
