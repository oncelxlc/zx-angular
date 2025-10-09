import { isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import * as monaco from "monaco-editor";

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
  private readonly monacoEditorContainer!: ElementRef;

  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const monacoEditor = monaco.editor.create(this.monacoEditorContainer.nativeElement, {
        value: [
          "function x() {",
          "\tconsole.log(\"Hello world!\");",
          "}",
        ].join("\n"),
      });
      console.log(monacoEditor);
    }
  }
}
