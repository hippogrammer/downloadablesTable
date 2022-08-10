import { ComponentFixture, TestBed } from '@angular/core/testing';
import { data } from 'src/app/data';

import { DownloadsTableComponent } from './downloads-table.component';

describe('DownloadsTableComponent', () => {
  let component: DownloadsTableComponent;
  let fixture: ComponentFixture<DownloadsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadsTableComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onSelectAllCheckboxClicked', () => {
    it('should set allSelected to true and push available files to selectedRows when checked', () => {
      expect(
        fixture.nativeElement.querySelectorAll('tbody > tr').length
      ).toEqual(data.length);
      (
        fixture.nativeElement.querySelector('#selectAll') as HTMLElement
      ).click();
      fixture.detectChanges();
      expect(component.selectedRows.size).toBe(2);
      expect(component.allSelected).toBeTrue;
      expect(
        fixture.nativeElement
          .querySelector('#downloadButton')
          .getAttribute('disabled')
      ).toBeFalsy;
      expect(
        fixture.nativeElement.querySelectorAll('tr.selected-row').length
      ).toBe(2);
      expect(
        fixture.nativeElement.querySelector('label[for="selectAll"]').innerText
      ).toBe('Selected 2');
    });

    it('should set allSelected to false and reset selectedRows when unchecked', () => {
      component.allSelected = true;
      component.data.forEach((data) => {
        if (data.status === 'available') {
          component.selectedRows.set(data.fileName, {
            path: data.path,
            device: data.device,
          });
        }
      });
      fixture.detectChanges();
      (
        fixture.nativeElement.querySelector('#selectAll') as HTMLElement
      ).click();
      fixture.detectChanges();
      expect(component.selectedRows.size).toBe(0);
      expect(component.allSelected).toBeFalse;
      expect(
        fixture.nativeElement
          .querySelector('#downloadButton')
          .getAttribute('disabled')
      ).toBeTruthy;
      expect(
        fixture.nativeElement.querySelectorAll('tr.selected-row').length
      ).toBe(0);
      expect(
        fixture.nativeElement.querySelector('label[for="selectAll"]').innerText
      ).toBe('None Selected');
    });
  });

  describe('onSelectionChange', () => {
    it('should add file data entry into selectedRows and add selected-row class to closest tr', async () => {
      fixture.whenStable().then(() => {
        let input = fixture.nativeElement.querySelector(
          'tbody > tr > td > input:not([disabled])'
        ) as HTMLInputElement;
        input.click();
        fixture.detectChanges();
        let selectedRow = input.closest('tr');
        expect(
          component.selectedRows.has(
            selectedRow
              ?.querySelector('[data-fileName]')
              ?.getAttribute('data-fileName')
          )
        ).toBeTrue;
        expect(selectedRow?.className).toBe('selected-row');
      });
    });
    it('should remove the file data entry from selectedRows and remove selected-row class to closest tr', async () => {
      let input = fixture.nativeElement.querySelector(
        'tbody > tr > td > input:not([disabled])'
      ) as HTMLInputElement;
      let selectedRow = input.closest('tr');
      component.selectedRows.set(
        input
          .closest('tr')
          ?.querySelector('[data-fileName]')
          ?.getAttribute('data-fileName'),
        {
          path: selectedRow
            ?.querySelector('[data-path]')
            ?.getAttribute('data-path'),
          device: selectedRow
            ?.querySelector('[data-device]')
            ?.getAttribute('data-device'),
        }
      );
      input.checked = true;
      input.click();
      fixture.detectChanges();
      expect(
        component.selectedRows.has(
          selectedRow
            ?.querySelector('[data-fileName]')
            ?.getAttribute('data-fileName')
        )
      ).toBeFalse();
      expect(selectedRow?.className).not.toBe('selected-row');
    });
  });

  describe('onDownloadClicked', () => {
    it('should successfully open an alert with the right information', async () => {
      fixture.whenStable().then(() => {
        spyOn(window, 'alert');
        let input = fixture.nativeElement.querySelector(
          'tbody > tr > td > input:not([disabled])'
        ) as HTMLInputElement;
        // let selectedRow = input.closest('tr');
        // component.selectedRows.set(
        //   input
        //     .closest('tr')
        //     ?.querySelector('[data-fileName]')
        //     ?.getAttribute('data-fileName'),
        //   {
        //     path: selectedRow
        //       ?.querySelector('[data-path]')
        //       ?.getAttribute('data-path'),
        //     device: selectedRow
        //       ?.querySelector('[data-device]')
        //       ?.getAttribute('data-device'),
        //   }
        // );
        input.click();
        fixture.detectChanges();

        fixture.nativeElement.querySelector('#downloadButton').click();
        let outputString = `
        File Name: netsh.exe
        Device: Targaryen
        Path: \\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe
          -------------------`;
        fixture.detectChanges();
        expect(window.alert).toHaveBeenCalled();
        expect(input.closest('tr')?.classList).not.toContain('selected-row');
        expect(input.checked).toBe(false);
      });
    });
  });
});
