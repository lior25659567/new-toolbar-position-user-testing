import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, SecondaryButton } from '../index';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs', 'ai-generated'],
  args: { content: 'Tooltip text', position: 'top', align: 'center', children: <SecondaryButton>Hover me</SecondaryButton> },
  argTypes: {
    position: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    delay: { control: 'number' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <SecondaryButton>Hover me</SecondaryButton>
    </Tooltip>
  ),
};

export const Positions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
        <Tooltip key={p} content={`Tooltip ${p}`} position={p}>
          <SecondaryButton>{p}</SecondaryButton>
        </Tooltip>
      ))}
    </div>
  ),
};
