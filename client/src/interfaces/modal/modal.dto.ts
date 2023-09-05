import { StructureInput, StructureModule } from '../common/structure.dto';

export interface ModalInitial {
  id: string;
  data: Record<string, any>;
  options?: { width?: string };
}
export interface ModalMain {
  content: ModalContent;
  inputs: StructureModule | null;
}
export interface ModalContent {
  id: string;
  title?: string;
  action: 'create' | 'edit' | 'delete' | 'static';
  request?: string;
  fileRequest?: string;
  method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
  fileMethod?: 'get' | 'post' | 'patch' | 'put' | 'delete';
  emit?: string;
  fileEmit?: string;
  message?: string;
  cancelName?: string | undefined;
  submitName?: string;
}
export interface ModalProps {
  input: StructureInput;
  data: Record<string, any>;
}
