import { redirect } from 'next/navigation';

/**
 * The showcase used to live at /portfolio. Kept as a permanent redirect so
 * existing links, bookmarks and search results keep working.
 */
export default function PortfolioRedirect() {
  redirect('/showcase');
}
