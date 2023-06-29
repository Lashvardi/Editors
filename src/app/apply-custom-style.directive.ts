import {
  Directive,
  ElementRef,
  Inject,
  Input,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { CourseArticleConfig } from './editorjs/custom-style.model';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appApplyCustomStyle]',
})
export class ApplyCustomStyleDirective {
  @Input() config!: CourseArticleConfig | null;
  private styleElement: HTMLStyleElement;
  private mutationObserver: MutationObserver;
  private createdClasses: { [key: string]: string } = {};

  constructor(
    private hostElement: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.mutationObserver = new MutationObserver(() => {
      this.setStyles(this.config);
    });

    // Create a single <style> element for the styles
    this.styleElement = this.renderer.createElement('style');
    this.renderer.appendChild(document.head, this.styleElement);
  }

  ngAfterViewInit(): void {
    this.mutationObserver.observe(this.hostElement.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes['config'].currentValue as CourseArticleConfig | null;
    this.setStyles(config);
  }

  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }

  setStyles(config: CourseArticleConfig | null) {
    if (config) {
      // Get the existing style tag
      let style = this.document.head.querySelector('style#customStyles');

      // If it doesn't exist, create a new one
      if (!style) {
        style = this.document.createElement('style');
        style.id = 'customStyles';
        this.document.head.appendChild(style);
      }

      // Clear the previous styles
      style.textContent = '';

      Object.entries(config.elements).forEach(([tag, styles]) => {
        const elements = this.hostElement.nativeElement.querySelectorAll(tag);
        if (elements.length) {
          const className = `${tag}-style`;
          elements.forEach((el: any) => {
            el.classList.add(className);
          });

          let css = '';
          Object.entries(styles).forEach(([prop, value]) => {
            if (prop === 'border') {
              const borderStyles = styles.border;
              if (borderStyles) {
                // ! Custom Behavior for border
                css += `
                  border-style: ${borderStyles.style || 'none'};
                  border-color: ${borderStyles.color || 'initial'} ;
                  border-top-width: ${borderStyles.top || '0px'};
                  border-right-width: ${borderStyles.right || '0px'};
                  border-bottom-width: ${borderStyles.bottom || '0px'};
                  border-left-width: ${borderStyles.left || '0px'};
                `;
              }
            } else {
              css += `${this.toCssNative(prop)}: ${value};`;
            }
          });

          const styleContent = `.${className} { ${css} }`;
          style!.textContent += styleContent;
        } else {
          console.warn(
            'Could not select the element: ' + tag,
            this.hostElement
          );
        }
      });

      console.log(style.textContent); // Log the generated stylesheet
    }
  }

  toCssNative(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}
