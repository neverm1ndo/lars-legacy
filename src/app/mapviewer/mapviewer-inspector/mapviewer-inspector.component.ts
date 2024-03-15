import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faBoxes, faCube } from '@fortawesome/free-solid-svg-icons';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { Subscription, filter, fromEvent, map, tap, withLatestFrom } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isNil, isUndefined } from 'lodash';
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

  keyboardNavigationSubsription = new Subscription();

  constructor(
    private readonly mapViewerFacade: MapViewerFacade
  ) { }

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  selectObject(index: number) {
    this.mapViewerFacade.setSelectedObjectIndex(index);
  }

  initKeyboardNavigation() {
    this.keyboardNavigationSubsription.add(
      fromEvent<KeyboardEvent>(window, 'keydown').pipe(
        withLatestFrom(this.selectedObjectIndex$, this.objects$),
        map(([event, index, objects]: [KeyboardEvent, number, MapObject[]]) => {
          event.preventDefault();
          if (event.key === 'ArrowUp' && index > 0) {
            this.mapViewerFacade.selectPrevious();
            return index - 1;
          }
          if (event.key === 'ArrowDown' && index < objects.length - 1) {
            this.mapViewerFacade.selectNext()
            return index + 1;
          }

          return null;
        }),
        filter((index) => !isNil(index))
      ).subscribe((index: number) => {
          const viewportSize = this.viewport.getViewportSize();
          const viewportOffset = this.viewport.measureScrollOffset('top');
          const itemSize = 22;

          const selectedOffset = (index + 1)*itemSize - viewportSize;

          if (selectedOffset > viewportOffset) {
            this.viewport.scrollToOffset(selectedOffset);
            return;
          }

          if (selectedOffset < viewportOffset - viewportSize + itemSize) {
            this.viewport.scrollToIndex(index);
          }
      })
    );
  }

  ngOnInit(): void {
    this.initKeyboardNavigation();
  }

  ngOnDestroy(): void {
    this.keyboardNavigationSubsription.unsubscribe();
  }
}
