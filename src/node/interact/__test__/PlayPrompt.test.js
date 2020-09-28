const dynamicValue = require('../../dynamicValue');
const { UUID_REGEXP, getParameter, getBranch } = require('../../testutil');
const PlayPrompt = require('../PlayPrompt');

describe('PlayPrompt', () => {
  describe('audio', () => {
    it('plays a static audio prompt', () => {
      const result = new PlayPrompt({
        promptAudioARN: 'arn:aws:connect',
        promptAudioName: 'Beep.wav',
      }).build();

      expect(result.metadata.useDynamic).toBe(false);
      expect(result.metadata.promptName).toBe('Beep.wav');
      expect(getParameter(result, 'AudioPrompt')).toEqual({
        name: 'AudioPrompt',
        value: 'arn:aws:connect',
        resourceName: 'Beep.wav',
      });
    });

    it('plays a dynamic audio prompt', () => {
      const result = new PlayPrompt({
        promptAudioARN: dynamicValue.System.QueueARN,
      }).build();

      expect(result.metadata.useDynamic).toBe(true);
      expect(result.metadata.promptName).toBeFalsy();
      expect(getParameter(result, 'AudioPrompt')).toEqual({
        name: 'AudioPrompt',
        namespace: 'System',
        value: 'Queue.ARN',
        resourceName: null,
      });
    });
  });

  describe('text-to-speech', () => {
    it('builds a static text prompt', () => {
      const result = new PlayPrompt({
        promptText: 'Simple text',
      }).build();

      expect(result.id).toMatch(UUID_REGEXP);
      expect(result.type).toBe('PlayPrompt');
      expect(result.metadata.useDynamic).toBe(false);
      expect(getParameter(result, 'Text')).toEqual({
        name: 'Text',
        value: 'Simple text',
      });
      expect(getParameter(result, 'TextToSpeechType')).toEqual({
        name: 'TextToSpeechType',
        value: 'text',
      });
    });

    it('builds a static SSML prompt', () => {
      const result = new PlayPrompt({
        promptText: '<speak>SSML text</speak>',
        promptTextToSpeechType: 'ssml',
      }).build();

      expect(result.metadata.useDynamic).toBe(false);
      expect(getParameter(result, 'Text')).toEqual({
        name: 'Text',
        value: '<speak>SSML text</speak>',
      });
      expect(getParameter(result, 'TextToSpeechType')).toEqual({
        name: 'TextToSpeechType',
        value: 'ssml',
      });
    });

    it('builds a dynamic text prompt', () => {
      const result = new PlayPrompt({
        promptText: dynamicValue.External('$.Attributes.foo'),
      }).build();

      expect(result.metadata.useDynamic).toBe(true);
      expect(getParameter(result, 'Text')).toEqual({
        name: 'Text',
        namespace: 'External',
        value: '$.Attributes.foo',
      });
      expect(getParameter(result, 'TextToSpeechType')).toEqual({
        name: 'TextToSpeechType',
        value: 'text',
      });
    });
  });

  describe('branching', () => {
    it('sets a success branch', () => {
      const blue = new PlayPrompt({ promptText: 'This is where we start' });
      const green = new PlayPrompt({
        promptText: 'This is where we end',
        successBranch: blue,
      });
      blue.setSuccessBranch(green);

      expect(getBranch(blue.build(), 'Success')).toEqual({
        condition: 'Success',
        transition: green.id,
      });

      expect(getBranch(green.build(), 'Success')).toEqual({
        condition: 'Success',
        transition: blue.id,
      });
    });
  });
});
