import { Component, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import ImageTool, { ImageConfig, ImageToolData } from '@editorjs/image';
import { CourseArticleConfig } from './custom-style.model';
import { FormArray, NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApplyCustomStyleDirective } from '../apply-custom-style.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-editorjs',
  templateUrl: './editorjs.component.html',
  styleUrls: ['./editorjs.component.scss'],
})
export class EditorjsComponent {
  editor: EditorJS | undefined;
  customStyle: object = {};
  outputData: any;
  outputHtml: string = '';
  someConfig: CourseArticleConfig = {
    fontFamilies: ['Helvetica', 'Arial', 'Roboto'],
    globalFontFamily: 'Serif',
    elements: {
      h1: {
        color: 'purple',
        fontFamily: 'Helvetica',
        fontSize: '2.2rem',
      },
      blockquote: {
        border: {
          color: '#4ace',
          width: '4px',
          style: 'solid',
        },
      },
    },
  };
  constructor(private fb: NonNullableFormBuilder) {}

  // * Form Group
  customStyles = this.fb.group({
    fontFamilies: this.fb.array(['Helvetica', 'Serif']),
    globalFontFamily: 'Helvetica',
    elements: this.fb.group({
      h1: this.fb.group({
        // ! Appp APP
        color: 'red',
        fontFamily: 'Helvetica',
        fontSize: '5rem',
        textAlign: 'left',
        fontStyle: 'normal',
      }),

      h2: this.fb.group({
        color: 'Red',
        fontFamily: 'Helvetica',
        textAlign: 'left',
        fontSize: '1.8rem',
        fontStyle: 'normal',
      }),

      h3: this.fb.group({
        color: 'black',
        fontFamily: 'Helvetica',
        fontSize: '1.6rem',
        textAlign: 'left',
        fontStyle: 'normal',
      }),
      p: this.fb.group({
        color: 'red',
        fontFamily: 'Helvetica',
        fontSize: '4rem',
        textAlign: 'left',
        fontStyle: 'normal',
        lineHeight: '1.5',
        letterSpacing: '0',
      }),
      blockquote: this.fb.group({
        color: 'gray',
        fontFamily: 'serif',
        fontSize: '1.2rem',
        fontStyle: 'normal',
        maxWidth: '100%',
        padding: '10px',
        margin: '0px',
        backgroundColor: 'white',
        textAlign: 'left',
        // ? Added here
        borderRadius: '0px',
        border: this.fb.group({
          color: 'orange',
          style: 'solid',
          // ! As I Know There is No Border Support Here
          radius: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '10px',
        }),
      }),

      a: this.fb.group({
        color: 'blue',
        fontFamily: 'serif',
        fontSize: '1.2rem',
        fontStyle: 'normal',
      }),
      '.test_box': this.fb.group({
        backgroundColor: 'black',
      }),
      markColor: this.fb.group({
        backgroundColor: ['yellow'],
      }),
      img: this.fb.group({
        maxWidth: '100%',
        padding: '10px',
        margin: '0px',
        borderRadius: '0px',
        border: this.fb.group({
          color: 'orange',
          style: 'solid',
          radius: '0px',
          width: '25px', // Set the desired border width here
        }),
      }),
    }),
  });

  customStyles$ = new BehaviorSubject<CourseArticleConfig>(
    (this.customStyle = this.customStyles.getRawValue())
  );

  async ngOnInit(): Promise<void> {
    // fetch the content from localStorage
    const localStorageContent = localStorage.getItem('editor-content');

    this.editor = new EditorJS({
      holderId: 'editor-js',
      tools: {
        header: Header,
        List: List,
        paragraph: Paragraph,
        Table: Table,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile',
              byUrl: 'http://localhost:8008/fetchUrl',
            },
          },
        },
      },
      data: localStorageContent ? JSON.parse(localStorageContent) : {},
      onChange: () => {
        this.editor?.save().then((outputData: any) => {
          // saving the content in localStorage everytime something changes
          localStorage.setItem('editor-content', JSON.stringify(outputData));
        });
      },
      defaultBlock: 'header',
      autofocus: true,
    });
  }

  JsonExport(): Promise<void> {
    return this.editor!.save()
      .then((outputData: any) => {
        console.log(JSON.stringify(outputData));
        this.outputData = outputData;
      })
      .catch((error: any) => {
        console.log('Saving failed: ', error);
      });
  }

  HtmlExport(): Promise<void> {
    return this.editor!.save()
      .then((outputData: { blocks: any[] }) => {
        let html = '';
        outputData.blocks.forEach((block) => {
          switch (block.type) {
            case 'header':
              html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
              break;
            case 'paragraph':
              html += `<p>${block.data.text}</p>`;
              break;
            // More cases as per your requirement
            default:
              console.log('Unknown block type', block.type);
              break;
          }
        });
        console.log(html);
        this.outputHtml = html;
      })
      .catch((error: any) => {
        console.log('Saving failed: ', error);
      });
  }
}
