import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag } from '../index';

const COLORS = ['blue', 'green', 'orange', 'red', 'purple', 'magenta'] as const;

const meta = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs', 'ai-generated'],
  args: { children: 'Label', color: 'blue', size: 'small' },
  argTypes: {
    color: { control: 'inline-radio', options: COLORS },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {COLORS.map((c) => <Tag key={c} color={c}>{c}</Tag>)}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Tag size="small">Small</Tag>
      <Tag size="medium">Medium</Tag>
    </div>
  ),
};

export const Dismissable: Story = { args: { children: 'Dismiss me', onDismiss: fn() } };
