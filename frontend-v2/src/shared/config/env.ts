import z from 'zod';

const creatEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
  });

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr as [string, string];
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  const parseEnv = EnvSchema.safeParse(envVars);
  if (!parseEnv.success) {
    const issues = parseEnv.error.issues;
    const message = issues.map((issue) => `- ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(
      `Invalid env provided.
      The following variables are missing or invalid:
      ${message}
      `,
    );
  }

  return parseEnv.data;
};

export const env = creatEnv();
