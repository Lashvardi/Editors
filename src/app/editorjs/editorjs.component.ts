import { Component, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import ImageTool, { ImageConfig, ImageToolData } from '@editorjs/image';

@Component({
  selector: 'app-editorjs',
  templateUrl: './editorjs.component.html',
  styleUrls: ['./editorjs.component.scss'],
})
export class EditorjsComponent {
  editor: any;

  ngOnInit(): void {
    this.editor = new EditorJS({
      holderId: 'editor-js',
      tools: {
        header: Header,
        List: List,
        Paragraph: Paragraph,
        Table: Table,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
              byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
            },
          },
        },
      },
    });
  }

  JsonExport(): Promise<void> {
    return this.editor
      .save()
      .then((outputData: any) => {
        console.log(JSON.stringify(outputData));
      })
      .catch((error: any) => {
        console.log('Saving failed: ', error);
      });
  }

  HtmlExport(): Promise<void> {
    return this.editor
      .save()
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
      })
      .catch((error: any) => {
        console.log('Saving failed: ', error);
      });
  }
}
