import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '../index';

const meta = {
  title: 'Feedback/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Uploading', value: 60, size: 'medium' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['medium', 'large'] },
    error: { control: 'text' },
    helper: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 360 }}><S /></div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProgressBar label="Uploading" value={40} />
      <ProgressBar label="Processing" value={72} />
      <ProgressBar label="Complete" value={100} />
      <ProgressBar label="Failed" value={100} error="Upload failed" />
    </div>
  ),
};
