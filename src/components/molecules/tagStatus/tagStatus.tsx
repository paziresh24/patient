import Chips from "../../atoms/chips";
import { BookStatus } from "@/types/bookStatus";
import clsx from "clsx";

export interface TagStatusProps {
  /**
   * Status of the turn
   */
  status: BookStatus;
  className: string;
}

export enum TagsStatusTranslation {
  expired = "منقضی",
  deleted = "حذف شده",
  visited = "ویزیت شده",
  requested = "درحال بررسی",
  not_visited = "ویزیت نشده",
  rejected = "رد شده",
}

export const TagStatus: React.FC<TagStatusProps> = (props) => {
  const { status, className } = props;

  return (
    <Chips className={clsx(className, "absolute left-4 top-2")} data-testid="tag-status">
      {TagsStatusTranslation[status as BookStatus]}
    </Chips>
  );
};

export default TagStatus;
