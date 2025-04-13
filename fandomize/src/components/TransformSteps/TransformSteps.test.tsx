/* eslint-disable @typescript-eslint/no-unused-expressions */
import { render, screen } from '@testing-library/react';
import TransformSteps from './TransformSteps';
import '@testing-library/jest-dom/extend-expect';

// Mocks para os componentes filhos
jest.mock('../MobileTabs/MobileTabs', () => ({
  __esModule: true,
  default: ({ tabs, activeTab, setActiveTab }: { tabs: string[]; activeTab: number; setActiveTab: (idx: number) => void }) => (
    <div data-testid="MobileTabs">
      MobileTabs: {tabs.join(',')} | {activeTab}
      <button onClick={() => setActiveTab(activeTab + 1)}>next</button>
    </div>
  ),
}));

jest.mock('../DesktopTabs/DesktopTabs', () => ({
  __esModule: true,
  default: ({ tabs, activeTab, setActiveTab }: { tabs: string[]; activeTab: number; setActiveTab: (idx: number) => void }) => (
    <div data-testid="DesktopTabs">
      DesktopTabs: {tabs.join(',')} | {activeTab}
      <button onClick={() => setActiveTab(activeTab + 1)}>next</button>
    </div>
  ),
}));

jest.mock('../TabContent/TabContent', () => ({
  __esModule: true,
  default: ({ activeTab, setActiveTab }: { activeTab: number; setActiveTab: (idx: number) => void }) => (
    <div data-testid="TabContent">
      TabContent: {activeTab}
      <button onClick={() => setActiveTab(activeTab - 1)}>back</button>
    </div>
  ),
}));

describe('TransformSteps Component', () => {
  const tabs = ['A', 'B', 'C'];
  let activeTab = 1;
  const setActiveTab = jest.fn((idx) => {
    activeTab = idx;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza containers e componentes filhos com props corretas', () => {
    render(
      <TransformSteps
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );

    // MobileTabs deve estar no container md:hidden
    const mobileContainer = screen.getByTestId('MobileTabs').parentElement;
    expect(mobileContainer).toHaveClass('md:hidden');
    expect(screen.getByTestId('MobileTabs')).toHaveTextContent('MobileTabs: A,B,C | 1');

    // DesktopTabs deve estar no container hidden md:flex
    const desktopContainer = screen.getByTestId('DesktopTabs').parentElement;
    expect(desktopContainer).toHaveClass('hidden', 'md:flex');
    expect(screen.getByTestId('DesktopTabs')).toHaveTextContent('DesktopTabs: A,B,C | 1');

    // TabContent deve estar dentro do flex-1 container
    const contentContainer = screen.getByTestId('TabContent').parentElement;
    expect(contentContainer).toHaveClass('flex-1', 'min-h-0', 'h-full', 'md:overflow-y-auto');
    expect(screen.getByTestId('TabContent')).toHaveTextContent('TabContent: 1');
  });

  test('setActiveTab é chamado ao clicar nos botões internos', () => {
    render(
      <TransformSteps
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );

    // Clica no botão "next" dentro de MobileTabs
    const mobileNext = screen.getByTestId('MobileTabs').querySelector('button');
    mobileNext && mobileNext.click();
    expect(setActiveTab).toHaveBeenCalledWith(2);

    // Clica no botão "next" dentro de DesktopTabs
    const desktopNext = screen.getByTestId('DesktopTabs').querySelector('button');
    desktopNext && desktopNext.click();
    expect(setActiveTab).toHaveBeenCalledWith(2);

    // Clica no botão "back" dentro de TabContent
    const back = screen.getByTestId('TabContent').querySelector('button');
    back && back.click();
    expect(setActiveTab).toHaveBeenCalledWith(0);
  });
});
