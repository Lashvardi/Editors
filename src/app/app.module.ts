import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorjsComponent } from './editorjs/editorjs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplyCustomStyleDirective } from './apply-custom-style.directive';

@NgModule({
  declarations: [AppComponent, EditorjsComponent, ApplyCustomStyleDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
