import prettier from 'prettier';

export const formatCode = async (code: string): Promise<string> => {
  try {
    return prettier.format(code, {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
      printWidth: 80,
    });
  } catch (error) {
    console.error('Error formatting code:', error);
    return code; // Return unformatted code in case of an error
  }
};
