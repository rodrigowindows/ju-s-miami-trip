

## Fix Missing Product Images

### Problem
The screenshot shows 2 out of 4 supplement products displaying placeholder icons instead of images. Multiple Health/supplement products share the same Unsplash URLs (`photo-1587854692152` and `photo-1593095948071`), and some of those are returning 404 errors. Additionally, there are duplicate products (e.g., "Probiotico 50 Bilhoes" vs "Probiotico 50 Bilhões").

### Root Cause
- 6 products use `photo-1587854692152` (same generic pill image — may be deleted/404)
- 2 products use `photo-1593095948071` (same image for Whey and Creatina — may be 404)
- Duplicate "Probiotico" entries with slightly different names

### Plan

**1. Database migration — Fix images + remove duplicate**

Update each Health product with a distinct, working Unsplash URL:

| Product | New Unsplash Photo ID |
|---|---|
| Whey Protein Gold Standard 2lb | protein powder photo |
| Creatina Monohidratada 400g | creatine/supplement photo |
| Probiotico 50 Bilhoes CFU | probiotic capsules photo |
| Vitamin D3 5000 IU 400 Softgels | vitamin D photo |
| Biotina 10.000mcg 250 Caps | biotin supplement photo |
| Hair Skin & Nails 250 Softgels | beauty supplement photo |
| Magnesium Glycinate 400mg | magnesium photo |
| Melatonina 10mg 300 Caps | melatonin/sleep photo |
| Centrum Mulher 200 Caps | multivitamin photo |
| Vitaminas Kirkland Daily Multi | daily vitamin photo |

Also delete the duplicate "Probiotico 50 Bilhões" (keeping "Bilhoes").

**2. Update `fix-image-urls.ts`**

Add the broken Unsplash IDs (`photo-1587854692152`, `photo-1593095948071`) to the `BROKEN_URL_FIXES` map as a frontend fallback, so even before the migration runs, images display correctly.

### Files Changed
- New SQL migration (via migration tool)
- `src/lib/fix-image-urls.ts` — add fallback entries

