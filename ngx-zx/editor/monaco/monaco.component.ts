import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: "zx-monaco",
  imports: [],
  template: `
    <section #monacoEditorContainer>
      monaco works!
    </section>
  `,
  styles: ``,
})
export class MonacoComponent implements AfterViewInit {
  @ViewChild("monacoEditorContainer", {static: true})
  monacoEditorContainer!: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.monacoEditorContainer.nativeElement);
  }
}
