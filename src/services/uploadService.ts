export async function uploadFile(file: File, tenantId: string, userEmail: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenant_id', tenantId);
  formData.append('user_email', userEmail);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro no upload do arquivo');
  }

  return response.json();
}
