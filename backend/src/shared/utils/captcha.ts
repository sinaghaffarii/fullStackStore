interface CaptchaVerifyResponse {
  success: boolean;
  errorCodes: string[];
}

export async function verifyCaptcha(
  token: string,
): Promise<CaptchaVerifyResponse> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not defined');
    return { success: false, errorCodes: ['missing-secret-key'] };
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      },
    );

    const data = await response.json();

    return {
      success: data.success === true,
      errorCodes: data['error-codes'] || [],
    };
  } catch (error) {
    console.error('Captcha verification error:', error);
    return { success: false, errorCodes: ['verification-failed'] };
  }
}
