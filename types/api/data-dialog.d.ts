import Vue from 'vue'
import  {ElMessageBoxOptions} from 'element-ui/types/message-box'
import {Form} from 'element-ui'
/** Options used in DataDialog */
export interface DataDialogOptions {
  /** onValidate function */
  onValidate: (model: Object) => Promise<any>

  /** forms Array */
  forms: any[]

  /** key */
  key?: string

  /** Custom class name for Message */
  formExtra?: Form

  /** msgBox */
  msgBox?: ElMessageBoxOptions
}

declare module 'vue/types/vue' {
  interface Vue {
  /** dataDialog edit or new data. */
    $dataDialog: (options: DataDialogOptions) => Promise<any>
  }
}