import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput, TextArea } from '../index';

const meta = {
  title: 'Inputs/Text Input',
  component: TextInput,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Label', placeholder: 'Placeholder' },
  argTypes: {
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    layerSet: { control: 'inline-radio', options: ['white', 'grey'] },
    forceState: { control: 'inline-radio', options: [undefined, 'hover', 'focus'] },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'Jane Cooper' } };
export const Focused: Story = { args: { forceState: 'focus', helper: 'Primary border + focus ring' } };
export const Required: Story = { args: { required: true } };
export const WithHelper: Story = { args: { helper: 'Optional helper text' } };
export const Error: Story = { args: { defaultValue: 'Invalid value', error: 'This field is required' } };
export const ErrorFocused: Story = { args: { defaultValue: 'Invalid value', error: 'This field is required', forceState: 'focus' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Disabled' } };
export const Password: Story = { args: { type: 'password', defaultValue: 'secret' } };

export const TextAreaDefault: StoryObj = {
  name: 'TextArea / Default',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 360 }}>
      <TextArea label="Notes" placeholder="Enter text…" maxLength={120} helper="Max 120 characters" />
    </div>
  ),
};
