import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { faBoxes, faCube } from '@fortawesome/free-solid-svg-icons';
import {
  Subscription,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  take,
  withLatestFrom
} from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isNil, range } from 'lodash';

import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { MapObject } from '../domain/entities';

@Component({
  selector: 'lars-mapviewer-inspector',
  templateUrl: './mapviewer-inspector.component.html',
  styleUrls: ['./mapviewer-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerInspectorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  fa = {
    faBoxes,
    faCube
  };

  objects$ = this.mapViewerFacade.getCurrentMapObjects();

  selectedObjectIndex$ = this.mapViewerFacade.getSelectedObjectIndex();
  selectedObjectIndexes$ = this.mapViewerFacade.getSelectedObjectIndexes();

  private keyboardNavigationSubsription = new Subscription();
  private changesSubsription = new Subscription();

  constructor(private readonly mapViewerFacade: MapViewerFacade) {}

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  selectObject<T extends MouseEvent>(event: T, index: number) {
    event.preventDefault();

    this.selectedObjectIndexes$.pipe(take(1)).subscribe((selected: number[]) => {
      if (!event.ctrlKey && !event.shiftKey) {
        return void this.mapViewerFacade.changeSelectedObjectIndex(index);
      }

      if (event.ctrlKey) {
        if (selected.includes(index)) {
          return void this.mapViewerFacade.unselectObject(index);
        }

        return void this.mapViewerFacade.setObjectSelected(index);
      }

      if (event.shiftKey) {
        const lastSelectedIndex =
          selected.length === 1 ? selected[selected.length - 1] : selected[0];
        const indexesRange =
          lastSelectedIndex < index
            ? range(lastSelectedIndex, index + 1)
            : range(index, lastSelectedIndex + 1);

        this.mapViewerFacade.selectMultiple(indexesRange);
      }
    });
  }

  selectMultiple(indexes: number[]) {
    this.mapViewerFacade.selectMultiple(indexes);
  }

  private initKeyboardNavigation() {
    this.keyboardNavigationSubsription.add(
      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          withLatestFrom(this.selectedObjectIndex$, this.objects$),
          map(([event, index, objects]: [KeyboardEvent, number, MapObject[]]) =>
            this.getIndexAfterKeyboardNavigation(event, index, objects.length)
          ),
          filter((index) => !isNil(index))
        )
        .subscribe((index: number) => {
          this.handleViewportScrollAfterKeyboardNavigation(index);
        })
    );
  }

  private getIndexAfterKeyboardNavigation(event: KeyboardEvent, index: number, length: number) {
    if (event.key === 'ArrowUp' && index > 0) {
      this.mapViewerFacade.selectPrevious();
      event.preventDefault();

      return index - 1;
    }
    if (event.key === 'ArrowDown' && index < length - 1) {
      this.mapViewerFacade.selectNext();
      event.preventDefault();

      return index + 1;
    }

    return null;
  }

  private handleViewportScrollAfterKeyboardNavigation(index: number): void {
    const viewportSize = this.viewport.getViewportSize();
    const viewportOffset = this.viewport.measureScrollOffset('top');
    const itemSize = 22;

    const selectedOffset = (index + 1) * itemSize - viewportSize;

    if (selectedOffset > viewportOffset) {
      this.viewport.scrollToOffset(selectedOffset);

      return;
    }

    if (selectedOffset < viewportOffset - viewportSize + itemSize) {
      this.viewport.scrollToIndex(index);
    }
  }

  ngOnInit(): void {
    this.initKeyboardNavigation();
  }

  ngAfterViewInit(): void {
    this.changesSubsription.add(
      this.objects$.pipe(distinctUntilChanged()).subscribe(() => {
        this.viewport.scrollToIndex(0);
      })
    );
  }

  ngOnDestroy(): void {
    this.keyboardNavigationSubsription.unsubscribe();
    this.changesSubsription.unsubscribe();
  }
}
