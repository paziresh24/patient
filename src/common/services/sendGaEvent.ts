interface SendGaEvent {
  action: string;
  category: string;
  label: string;
}

export const sendGaEvent = ({ action, category, label }: SendGaEvent) => {
  if (window.ga ?? false) {
    window.ga('create', 'UA-74836147-1', 'auto');
    window.ga('send', 'event', action, category, label);
    return true;
  } else return false;
};
