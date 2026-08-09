import LauncherMain from '.plasmic/LauncherMain';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';

type LegacyLauncherSectionProps = {
  onAction: (action: { action: string; appKey: string }) => void;
};

export const LegacyLauncherSection = ({ onAction }: LegacyLauncherSectionProps) => (
  <GlobalContextsProvider>
    <LauncherMain onAction={onAction} />
  </GlobalContextsProvider>
);

export default LegacyLauncherSection;
