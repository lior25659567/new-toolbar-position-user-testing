import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Notification } from '../index';

const meta = {
  title: 'Feedback/Notification',
  component: Notification,
  tags: ['autodocs', 'ai-generated'],
  args: { type: 'info', title: 'Heads up', children: 'This is a notification message.' },
  argTypes: {
    type: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 420 }}><S /></div>],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { type: 'success', title: 'Saved', children: 'Your changes were saved.' } };
export const Warning: Story = { args: { type: 'warning', title: 'Careful', children: 'This action may have side effects.' } };
export const Error: Story = { args: { type: 'error', title: 'Something went wrong', children: 'Please try again.' } };
export const Dismissable: Story = { args: { onDismiss: fn() } };

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Notification type="info" title="Info">Informational message.</Notification>
      <Notification type="success" title="Success">It worked.</Notification>
      <Notification type="warning" title="Warning">Heads up.</Notification>
      <Notification type="error" title="Error">It failed.</Notification>
    </div>
  ),
};
