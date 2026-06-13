import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Toggle } from '../index';

const meta = {
  title: 'Selection/Toggle',
  component: Toggle,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Enabled', onChange: fn() },
  argTypes: {
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelPosition: { control: 'inline-radio', options: ['right', 'left'] },
    forceState: { control: 'inline-radio', options: [undefined, 'hover', 'pressed', 'focus'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 16, alignItems: 'center' }}>
      <Toggle label="Off" />
      <Toggle label="On" defaultChecked />
      <Toggle label="Off / Hover" forceState="hover" />
      <Toggle label="On / Hover" defaultChecked forceState="hover" />
      <Toggle label="Off / Focused" forceState="focus" />
      <Toggle label="On / Focused" defaultChecked forceState="focus" />
      <Toggle label="Off / Disabled" disabled />
      <Toggle label="On / Disabled" defaultChecked disabled />
    </div>
  ),
};
