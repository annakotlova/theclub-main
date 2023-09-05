// import { StructureInput } from '@/interfaces/common/structure.dto';
import { ModalMain } from '@/interfaces/modal/modal.dto';
import eventAPI from '@/api/event';

export const modalRequests = (modal: ModalMain): void => {
  const isEventSupport = modal.content.id === 'event-support';

  // const inputs = modal.inputs?.inputs as StructureInput[];
  const data = modal.inputs?.data as Record<string, any>;
  if (isEventSupport) getMemberList(data);
};

const getMemberList = async (data: Record<string, any>) => {
  const response = await eventAPI.getMemberList(data._id);
  data.selected = response.data.supports.map((s) => s.member);
  data.list = response.data.members;
};
