import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import Processes, {
  Process,
} from "@lars/shared/components/line-process/log-processes";
import { Subscription, map } from "rxjs";

export interface ProcessWithName extends Process {
  name?: keyof typeof Processes | string;
  checked?: boolean;
}

@Component({
  selector: "filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {
  public searchInput: string = "";

  public filterForm: FormGroup = this._formBuilder.group({
    processes: this._formBuilder.array(this.getFilterFromStorage()),
  });

  private _filterChangesSubscription: Subscription;

  constructor(private _formBuilder: FormBuilder) {}

  get processes(): FormArray {
    return this.filterForm.get("processes") as FormArray;
  }

  private get _processes(): ProcessWithName[] {
    return Object.entries(Processes).map(
      ([key, val]: [string, ProcessWithName]) => {
        val.name = key;
        return val;
      },
    );
  }

  public get allProcesses(): ProcessWithName[] {
    return this._processes;
  }

  getFilterFromStorage(): boolean[] {
    const processes = this._processes.map((_process) => true);

    try {
      const storedFilter: string | null = window.localStorage.getItem("filter");
      if (!storedFilter) throw new Error("EMPTY_FILTER");

      const filtered: [number, ProcessWithName][] = JSON.parse(
        window.localStorage.getItem("filter"),
      );

      for (let [index, _control] of filtered) {
        processes[index] = false;
      }

      this._processes.map((process: ProcessWithName, index: number) => [
        process,
        index,
      ]);

      return processes;
    } catch (err) {
      console.warn(err.message, "Filter reset  to default");
      return processes;
    }
  }

  ngOnInit(): void {
    this._filterChangesSubscription =
      this.filterForm.controls.processes.valueChanges
        .pipe(
          map((value: any[]) => {
            const processes: ProcessWithName[] = this._processes;

            return value
              .map((val: boolean, index: number) => [index, val])
              .filter(([_index, val]: [number, boolean]) => !val)
              .map(([index, _val]: [number, boolean]) => [
                index,
                processes[index].control,
              ]);
          }),
        )
        .subscribe((res) => {
          window.localStorage.setItem("filter", JSON.stringify(res));
        });
  }

  ngOnDestroy(): void {
    this._filterChangesSubscription.unsubscribe();
  }
}
