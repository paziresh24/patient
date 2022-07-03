import Chips from "../../atoms/chips";
import { BookStatus } from "@/types/bookStatus";

export interface TagStatusProps {
  /**
   * Status of the turn
   */
  status: BookStatus;
}

export enum TagsStatusTranslation {
  expired = "منقضی",
  deleted = "حذف شده",
  visited = "ویزیت شده",
  requested = "درخواست",
  not_visited = "ویزیت نشده",
  rejected = "رد شده",
}

export const TagStatus: React.FC<TagStatusProps> = (props) => {
  const { status } = props;

  return (
    <Chips className="absolute left-4 top-2" data-testid="tag-status">
      {TagsStatusTranslation[status as BookStatus]}
    </Chips>
  );
};

export default TagStatus;
