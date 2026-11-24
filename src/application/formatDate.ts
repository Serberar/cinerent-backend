export const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
