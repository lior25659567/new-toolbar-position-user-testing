import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from '../index';

const meta = {
  title: 'Selection/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Option A', size: 20, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: [16, 20, 24] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    forceState: { control: 'inline-radio', options: [undefined, 'hover', 'focus'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { checked: true, indeterminate: true, label: 'Select all' } };
export const Disabled: Story = { args: { disabled: true } };

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" checked onChange={() => {}} />
      <Checkbox label="Indeterminate" checked indeterminate onChange={() => {}} />
      <Checkbox label="Hover" forceState="hover" />
      <Checkbox label="Focused" forceState="focus" />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
};
