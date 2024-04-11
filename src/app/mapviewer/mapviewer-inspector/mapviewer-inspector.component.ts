import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faBoxes, faCube } from '@fortawesome/free-solid-svg-icons';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { Subscription, distinctUntilChanged, filter, fromEvent, map, withLatestFrom } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isNil } from 'lodash';
import { MapObject } from '../domain/entities';

@Component({
  selector: 'lars-mapviewer-inspector',
  templateUrl: './mapviewer-inspector.component.html',
  styleUrls: ['./mapviewer-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerInspectorComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  fa = {
    faBoxes,
    faCube
  };

  objects$ = this.mapViewerFacade.getCurrentMapObjects();

  selectedObjectIndex$ = this.mapViewerFacade.getSelectedObjectIndex();

  private keyboardNavigationSubsription = new Subscription();
  private changesSubsription = new Subscription();

  constructor(private readonly mapViewerFacade: MapViewerFacade) {}

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  selectObject(index: number) {
    this.mapViewerFacade.setSelectedObjectIndex(index);
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
