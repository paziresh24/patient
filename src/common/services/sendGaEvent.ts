interface SendGaEvent {
  action: string;
  category: string;
  label: string;
}

export const sendGaEvent = ({ action, category, label }: SendGaEvent) => {
  return false;
};
