// Shared seeded foresight scenario data, types, and helpers
// Used by Dashboard, CategoryListView, and workspace components

export interface AnalysisItem {
  _id?: string
  signal_id?: string
  orchestrator_summary?: string
  specialist_outputs?: any[]
  signal_types?: string[]
  priority_actions?: any[]
  cross_cutting_themes?: string
  createdAt?: string
}

export interface SeededSignal { id: string; title: string; brand: string; market: string; urgency: string; why: string; nextStep: string; crossCutting: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[]; timestamp: string }
export interface SeededAction { title: string; priority: string; owner: string; impact: string; timeline: string; scenarioId: string }
export interface SeededOpportunity { title: string; brand: string; market: string; why: string; confidence: string; move: string; scenarioId: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[] }
export interface SeededRisk { title: string; brand: string; market: string; severity: string; cause: string; action: string; scenarioId: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[] }
export interface SeededAlert { title: string; brand: string; market: string; severity: string; why: string; response: string; scenarioId: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[] }
export interface SeededAnalysis { id: string; title: string; brand: string; market: string; signalTypes: string[]; summary: string; timestamp: string; scenarioId: string }

// ── Helpers ──

export function urgencyBadge(urgency: string) {
  const u = (urgency || '').toLowerCase()
  if (u === 'critical') return 'bg-red-500/15 text-red-400 border border-red-500/30'
  if (u === 'high') return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
  if (u === 'medium') return 'bg-blue-400/15 text-blue-400 border border-blue-400/30'
  return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
}

export function severityDot(sev: string) {
  const s = (sev || '').toLowerCase()
  if (s === 'critical') return 'bg-red-500'
  if (s === 'high') return 'bg-amber-500'
  if (s === 'medium') return 'bg-blue-400'
  return 'bg-emerald-500'
}

export function cleanText(text: string, maxLen = 90): string {
  if (!text) return ''
  const clean = text.replace(/\*\*/g, '').replace(/[#]/g, '').replace(/\n/g, ' ').trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}

export function priorityOrder(p: string): number {
  const v = (p || '').toLowerCase()
  if (v === 'critical') return 0
  if (v === 'high') return 1
  if (v === 'medium') return 2
  return 3
}

export function isHighPriority(p: string): boolean {
  const v = (p || '').toLowerCase()
  return v === 'critical' || v === 'high'
}

// ── Priority Signals ──
export const SEEDED_SIGNALS: SeededSignal[] = [
  {
    id: 's1', title: 'Peptide Scalp-Care Opportunity Emerging in Southeast Asia', brand: 'Garnier / Kerastase', market: 'Southeast Asia', urgency: 'High',
    why: 'Search volume for "peptide scalp serum" is up 280% QoQ in Southeast Asia. Social discussion centres on scalp barrier health among 18-34 consumers. Current offerings are fragmented with no category leader.',
    nextStep: 'Commission consumer research in Indonesia and Thailand to validate demand sizing and price sensitivity',
    crossCutting: 'Preventive hair wellness is an emerging behaviour shift that connects scalp health, active ingredients, and self-care culture.',
    timestamp: '2026-03-24T08:45:00Z',
    detailSections: [
      { label: 'What Changed', content: 'Search and social discussion around scalp barrier health and peptide-based scalp serums is rising in Southeast Asia, especially among younger consumers seeking preventive hair wellness routines. Current offerings are fragmented and education is still limited.' },
      { label: 'Why It Was Flagged', content: 'This represents a whitespace opportunity where no major brand owns the category narrative. Consumer behaviour is shifting from reactive hair repair to preventive scalp wellness, and peptide-based formulations are the emerging science story driving interest.' },
      { label: 'Market Intelligence', content: 'Google Trends data shows "scalp serum" search volume up 280% QoQ in Indonesia, Philippines, and Thailand. TikTok and Instagram Reels content around scalp-care routines is generating 3-5x higher engagement than traditional hair-care content.' },
      { label: 'What Teams Should Do', content: 'Commission consumer research in Indonesia and Thailand to validate demand sizing and price sensitivity. Evaluate existing Kerastase and Garnier scalp-care formulations for Southeast Asia market adaptation.' },
    ],
    relatedActions: [
      { action: 'Commission scalp-care consumer research in Southeast Asia', priority: 'High', owner: 'Consumer Insights APAC', rationale: 'Validate market size and consumer willingness to pay before product development' },
      { action: 'Evaluate peptide scalp serum formulation pipeline', priority: 'High', owner: 'R&D Hair Care', rationale: 'Determine time-to-market for peptide-based scalp product' },
      { action: 'Map competitive landscape in Southeast Asia scalp-care', priority: 'Medium', owner: 'Strategy APAC', rationale: 'Identify gaps and positioning opportunities before committing resources' },
    ],
  },
  {
    id: 's2', title: 'The Ordinary Vitamin C Suspension Gaining SOV in UK Brightening', brand: "L'Oreal Paris", market: 'United Kingdom', urgency: 'Critical',
    why: 'The Ordinary (DECIEM / Estée Lauder) has launched an updated Vitamin C Suspension 23% + HA Spheres with aggressive creator seeding and dermatologist endorsements in the UK. L\'Oréal Paris SOV in brightening has dropped 18 points in 4 weeks.',
    nextStep: 'Accelerate UK Revitalift Clinical Vitamin C serum launch timeline and activate counter-narrative with owned clinical data',
    crossCutting: 'Speed of competitive response in creator-led categories determines long-term SOV positioning.',
    timestamp: '2026-03-23T14:20:00Z',
    detailSections: [
      { label: 'What Changed', content: 'The Ordinary (owned by Estée Lauder via DECIEM) has relaunched its Vitamin C Suspension 23% + HA Spheres in the UK with strong creator seeding, dermatologist-led content on TikTok and Instagram, and prominent retail placement at Boots and Space NK. Search and social attention are consolidating around The Ordinary\'s claims.' },
      { label: 'Why It Was Flagged', content: 'The Ordinary\'s SOV in "brightening serum UK" search cluster has risen from 12% to 38% in 4 weeks. Their creator programme includes 40+ UK-based dermatology and skincare influencers. Retail placement includes Boots premium endcap and Space NK feature wall. At the £12 price point, they are undercutting L\'Oréal Paris Revitalift Clinical.' },
      { label: 'Impact on L\'Oreal Paris', content: 'Our planned Q2 Revitalift Clinical 12% Pure Vitamin C launch in the UK is at risk of entering a market where The Ordinary\'s claims are already established. Without counter-positioning, the launch will appear reactive. The Ordinary\'s price advantage (£12 vs £30) requires a clinical efficacy differentiation strategy.' },
      { label: 'What Teams Should Do', content: 'Accelerate UK Revitalift Clinical launch timeline by 3-4 weeks. Activate proprietary clinical trial data showing superior brightening efficacy at 12 weeks. Engage UK-based dermatologists for counter-narrative content before The Ordinary\'s narrative solidifies.' },
    ],
    relatedActions: [
      { action: 'Accelerate UK Revitalift Clinical Vitamin C launch by 3-4 weeks', priority: 'Critical', owner: 'Brand Management UK', rationale: 'Prevent The Ordinary from solidifying category ownership in UK brightening' },
      { action: 'Activate clinical data counter-narrative vs The Ordinary', priority: 'Critical', owner: 'Medical Affairs / PR', rationale: 'Differentiate on clinical evidence vs. The Ordinary\'s creator-led claims' },
      { action: 'Secure Boots premium placement for Revitalift Clinical launch week', priority: 'High', owner: 'Commercial UK', rationale: 'Match The Ordinary\'s retail visibility at Boots and Space NK' },
    ],
  },
  {
    id: 's5', title: 'Exosome Skincare Interest Accelerating in Premium Anti-Aging', brand: 'Lancome / Helena Rubinstein', market: 'South Korea / US / Europe', urgency: 'High',
    why: 'Search and creator discussion around exosome-based skincare is accelerating among premium consumers. The narrative centres on advanced repair and regeneration, but consumer understanding is early and fragmented.',
    nextStep: 'Evaluate exosome technology integration into Lancome Advanced Genifique pipeline and commission regulatory feasibility review',
    crossCutting: 'Exosome technology bridges biotech and beauty in ways that could redefine premium anti-aging positioning.',
    timestamp: '2026-03-22T11:30:00Z',
    detailSections: [
      { label: 'What Changed', content: 'Search, social, and creator discussion around exosome-based skincare is accelerating among premium consumers. South Korean brands AmorePacific (AMOREPACIFIC Exosome Serum) and Sulwhasoo are leading clinical channel launches. US brands like Augustinus Bader are exploring exosome-adjacent positioning.' },
      { label: 'Opportunity Assessment', content: 'Exosome skincare represents the next frontier in biotech beauty. AmorePacific and Sulwhasoo are first to market but confined to South Korean clinical channels. No global luxury brand has claimed the exosome narrative in mainstream premium skincare. Estée Lauder and Shiseido have not publicly announced exosome product development.' },
      { label: 'Strategic Fit', content: 'Lancome Advanced Genifique and Helena Rubinstein Prodigy lines are well positioned to integrate exosome technology. Advanced Genifique\'s microbiome science positioning can naturally extend to exosome delivery. First-mover advantage against Estée Lauder (Advanced Night Repair) and Shiseido (Ultimune) is achievable.' },
      { label: 'What Teams Should Do', content: 'Evaluate exosome technology integration into Advanced Genifique pipeline. Commission regulatory feasibility review for EU, US, and China markets. Begin science communication groundwork with key dermatology KOLs before AmorePacific or Estée Lauder claim the global narrative.' },
    ],
    relatedActions: [
      { action: 'Evaluate exosome technology for Lancome Genifique pipeline', priority: 'High', owner: 'R&D Skincare Innovation', rationale: 'First global luxury brand to market with exosome claims will define category ahead of Estée Lauder and Shiseido' },
      { action: 'Commission multi-market regulatory feasibility review', priority: 'High', owner: 'Regulatory Affairs', rationale: 'Exosome claims require careful navigation across EU, US, and China regulatory frameworks' },
      { action: 'Begin KOL science communication programme', priority: 'Medium', owner: 'Medical Affairs', rationale: 'Build credibility infrastructure before AmorePacific or competitors expand globally' },
    ],
  },
]

// ── Active Opportunities ──
export const SEEDED_OPPORTUNITIES: SeededOpportunity[] = [
  {
    title: 'Peptide Scalp-Care Category Leadership in Southeast Asia', brand: 'Garnier / Kerastase', market: 'Southeast Asia', confidence: 'High',
    why: 'No category leader exists in peptide scalp-care in Southeast Asia. Consumer search and social signals show strong and growing demand. The preventive hair wellness positioning aligns with regional self-care trends among 18-34 consumers.',
    move: 'Fast-track peptide scalp serum development with Southeast Asia-specific formulation. Target Q4 2026 launch in Indonesia and Thailand with creator-led education campaign.',
    scenarioId: 's1',
    detailSections: [
      { label: 'What Changed', content: 'Peptide scalp-care is an emerging category with no established leader in Southeast Asia. Consumer interest is driven by the shift from reactive hair repair to preventive scalp wellness.' },
      { label: 'Market Sizing', content: 'The Southeast Asia scalp-care market is estimated at $340M and growing at 18% CAGR. Peptide-based products represent less than 5% of current offerings, indicating significant upside.' },
      { label: 'Competitive Landscape', content: 'Current offerings are fragmented across local brands and K-beauty imports. No global brand has established a dominant position. Kerastase has existing scalp-care credibility that can be leveraged.' },
    ],
    relatedActions: [
      { action: 'Fast-track peptide scalp serum for Southeast Asia', priority: 'High', owner: 'R&D Hair Care', rationale: 'First-mover advantage in category with no established leader' },
      { action: 'Develop creator-led scalp education campaign', priority: 'High', owner: 'Digital Marketing APAC', rationale: 'Education is key; consumers are interested but knowledge is limited' },
    ],
  },
  {
    title: 'Ectoin Barrier-Support Positioning in Sensitive Skincare', brand: 'La Roche-Posay / CeraVe', market: 'Global', confidence: 'Medium',
    why: 'Consumer and creator interest in ectoin is rising as barrier-repair remains important. La Roche-Posay and CeraVe have strong barrier-care positioning to leverage.',
    move: 'Develop ectoin-enhanced formulation for existing barrier-care ranges. Position as next-generation ingredient story within established product lines.',
    scenarioId: 's6',
    detailSections: [
      { label: 'What Changed', content: 'Ectoin is gaining traction as a barrier-support ingredient with rising consumer and creator interest in calming and environmental stress defense. Merck has expanded ectoin supply for cosmetic use, making formulation more accessible.' },
      { label: 'Strategic Fit', content: 'La Roche-Posay Toleriane and CeraVe barrier ranges are natural homes for ectoin integration. Both brands have stronger dermatologist credibility than competitors Bioderma (Sensibio) and Avène (Tolérance) in this space.' },
      { label: 'Competitive Window', content: 'Ectoin awareness is still early. Dr. Jart+ (Estée Lauder) has an ectoin product in South Korea, and Paula\'s Choice (Unilever) is testing ectoin formulations. Neither has scaled globally. Window is 12-18 months before Unilever or Estée Lauder move aggressively.' },
    ],
    relatedActions: [
      { action: 'Evaluate ectoin formulation for La Roche-Posay Toleriane range', priority: 'Medium', owner: 'R&D Active Cosmetics', rationale: 'Leverage existing barrier-care positioning before Dr. Jart+ or Paula\'s Choice scale globally' },
      { action: 'Develop ectoin ingredient education content', priority: 'Medium', owner: 'Medical Marketing', rationale: 'Build consumer understanding before Unilever or Estée Lauder establish ectoin narrative' },
    ],
  },
  {
    title: 'Copper Peptide Longevity Positioning in Premium Skincare', brand: 'Helena Rubinstein / Lancome', market: 'Global Premium', confidence: 'Medium',
    why: 'Copper peptides are re-emerging in premium conversations linked to skin longevity and healthy aging. The framing is becoming more sophisticated and science-led.',
    move: 'Develop copper peptide integration roadmap for Helena Rubinstein Prodigy line. Position as longevity-science ingredient rather than traditional repair.',
    scenarioId: 's9',
    detailSections: [
      { label: 'What Changed', content: 'Copper peptides are reappearing in premium skincare conversations, now linked to skin longevity and healthy aging narratives. Dr. Pickart\'s GHK-Cu research is being widely cited on Reddit SkincareAddiction and dermatology YouTube channels.' },
      { label: 'Consumer Insight', content: 'Premium skincare consumers aged 35-55 are increasingly interested in longevity-positioned products. Copper peptides offer a credible science story. Niod (DECIEM / Estée Lauder) Copper Amino Isolate Serum is the current reference product but positioned as niche.' },
      { label: 'Competitive Landscape', content: 'Niod (Estée Lauder) has the only established copper peptide serum but lacks luxury positioning. La Prairie and Sisley have not entered the copper peptide space. Helena Rubinstein Prodigy could claim the luxury copper peptide narrative first.' },
    ],
    relatedActions: [
      { action: 'Develop copper peptide integration for Helena Rubinstein Prodigy', priority: 'Medium', owner: 'R&D Premium Skincare', rationale: 'Claim luxury copper peptide positioning before La Prairie or Sisley enter the space' },
      { action: 'Commission longevity positioning research', priority: 'Low', owner: 'Consumer Insights', rationale: 'Validate longevity framing resonance with premium consumers aged 35-55' },
    ],
  },
]

// ── Launch Risks ──
export const SEEDED_RISKS: SeededRisk[] = [
  {
    title: 'Elvive Bond Repair Launch Underperforming vs Olaplex in Germany', brand: "L'Oreal Paris Elvive", market: 'Germany', severity: 'High',
    cause: 'Elvive Bond Repair product page traffic is healthy but conversion is low on Douglas.de and dm.de. Reviews show confusion around benefit differentiation vs. Olaplex No.3 and existing Elvive Total Repair range. Creator support is limited.',
    action: 'Conduct rapid UX audit of Douglas and dm product pages. Rebrief creator programme with clear Olaplex comparison messaging. Test A/B product page copy.',
    scenarioId: 's3',
    detailSections: [
      { label: 'What Changed', content: 'L\'Oréal Paris Elvive Bond Repair is seeing weaker-than-expected traction in Germany e-commerce. Product page traffic on Douglas.de and dm.de is at 85% of target, but conversion is significantly below benchmark. Olaplex No.3 Hair Perfector continues to dominate the bond repair category in Germany.' },
      { label: 'Performance Data', content: 'Product page visits at 85% of target, but add-to-cart rate is 2.1% vs. 4.8% benchmark. Early reviews (62 total) show 3.2/5 average rating with recurring themes of "not sure how this is different from Olaplex." Creator content volume at 30% of plan. Olaplex No.3 holds 52% share of the bond repair category on Douglas.de.' },
      { label: 'Root Cause Assessment', content: 'Three contributing factors: (1) Benefit messaging does not clearly differentiate from Olaplex or existing Elvive Total Repair 5 range, (2) Creator briefs were generic and did not address the Olaplex comparison consumers are making, (3) At €13.99 vs Olaplex at €28, the price advantage is not being communicated effectively.' },
      { label: 'What Teams Should Do', content: 'Conduct rapid UX audit of Douglas.de and dm.de product pages. Rebrief creator programme with clear "salon-grade bond repair at half the price" messaging. Consider limited-time trial pricing or bundle with Elvive shampoo to drive initial conversion.' },
    ],
    relatedActions: [
      { action: 'Conduct rapid e-commerce UX audit on Douglas.de and dm.de', priority: 'High', owner: 'Digital Commerce Germany', rationale: 'Low conversion despite healthy traffic indicates product page messaging issues vs Olaplex' },
      { action: 'Rebrief creator programme with Olaplex comparison messaging', priority: 'High', owner: 'Influencer Marketing Germany', rationale: 'Current creator content lacks benefit clarity vs the category leader' },
      { action: 'Test A/B product page copy with price advantage messaging', priority: 'Medium', owner: 'E-Commerce Team Germany', rationale: 'Validate whether explicit Olaplex comparison or price messaging drives conversion' },
    ],
  },
  {
    title: 'Peptide Eye-Care Launch Crowded by Estée Lauder and Shiseido', brand: "L'Oreal Paris / Lancome", market: 'Global', severity: 'High',
    cause: 'Estée Lauder Advanced Night Repair Eye with peptide complex and Shiseido Benefiance Wrinkle Smoothing Eye Cream have both intensified messaging with overlapping peptide claims. Category is crowded ahead of our launch.',
    action: 'Reposition launch messaging away from generic peptide claims toward proprietary Pro-Retinol + Peptide technology narrative. Delay launch by 2-3 weeks to refine creative.',
    scenarioId: 's7',
    detailSections: [
      { label: 'What Changed', content: 'L\'Oréal is preparing to launch a peptide eye-care product, but Estée Lauder (Advanced Night Repair Eye Supercharged Gel-Creme), Shiseido (Benefiance Wrinkle Smoothing Eye Cream), and Drunk Elephant (C-Tango Multivitamin Eye Cream) have all intensified peptide eye-care messaging in the past 8 weeks.' },
      { label: 'Competitive Noise Assessment', content: 'Estée Lauder, Shiseido, and Drunk Elephant have launched or refreshed peptide eye-care products simultaneously. Total social mentions of "peptide eye cream" are up 420%, but consumer sentiment shows growing confusion. Estée Lauder is spending heavily on dermatologist endorsements for ANR Eye.' },
      { label: 'Differentiation Gap', content: 'Current launch messaging relies on "peptide complex for eye area" which directly overlaps with Estée Lauder ANR Eye and Shiseido Benefiance claims. Internal clinical data shows superior results on dark circles (-40% in 4 weeks) and puffiness (-35%), but this is not reflected in planned comms.' },
      { label: 'What Teams Should Do', content: 'Reposition launch messaging toward proprietary Pro-Retinol + Peptide technology. Leverage clinical data on dark circles and puffiness as clear differentiation vs Estée Lauder and Shiseido. Consider delaying launch by 2-3 weeks to refine creative.' },
    ],
    relatedActions: [
      { action: 'Reposition peptide eye-care launch vs Estée Lauder and Shiseido', priority: 'High', owner: 'Brand Strategy', rationale: 'Generic peptide claims will not cut through Estée Lauder ANR Eye and Shiseido Benefiance noise' },
      { action: 'Activate clinical differentiation data (dark circles -40%, puffiness -35%)', priority: 'High', owner: 'Medical Affairs / PR', rationale: 'Proprietary clinical results are the strongest lever against Estée Lauder claims' },
      { action: 'Evaluate launch timeline adjustment (2-3 weeks)', priority: 'Medium', owner: 'Brand Management', rationale: 'Better to launch with strong differentiation than rush into a crowded narrative' },
    ],
  },
]

// ── Claims / Reputation Alerts ──
export const SEEDED_ALERTS: SeededAlert[] = [
  {
    title: 'Retinol Irritation Concern Building in France', brand: 'La Roche-Posay / Vichy', market: 'France', severity: 'Critical',
    why: 'Review and social chatter show rising concern around irritation and improper use of a retinol product. No formal safety issue is confirmed, but consumer interpretation is turning negative.',
    response: 'Issue updated usage guidance with dermatologist-backed education. Proactively address concerns through owned channels before media picks up the narrative.',
    scenarioId: 's4',
    detailSections: [
      { label: 'What Changed', content: 'Review and social chatter in France show rising concern around irritation and improper use of a retinol product. Consumer interpretation is turning negative.' },
      { label: 'Sentiment Analysis', content: 'Negative sentiment around retinol irritation has increased 340% in French social channels over 6 weeks. Key themes: "too strong for daily use," "burned my skin." 23% of recent reviews mention irritation.' },
      { label: 'Risk Assessment', content: 'While no pharmacovigilance signal is confirmed, the consumer perception risk is significant. If a French media outlet picks up the narrative, it could impact the broader retinol portfolio.' },
      { label: 'What Teams Should Do', content: 'Issue updated usage guidance with dermatologist-backed content. Proactively address concerns through owned social channels. Brief customer service teams. Monitor for escalation.' },
    ],
    relatedActions: [
      { action: 'Issue updated retinol usage guidance in France', priority: 'Critical', owner: 'Medical Affairs France', rationale: 'Proactive education is essential before narrative escalates' },
      { action: 'Activate dermatologist-backed content on owned channels', priority: 'Critical', owner: 'Digital Marketing France', rationale: 'Counter negative UGC with authoritative guidance' },
      { action: 'Brief customer service teams on retinol talking points', priority: 'High', owner: 'Consumer Relations', rationale: 'Ensure consistent and reassuring response to inquiries' },
    ],
  },
  {
    title: 'Spicule Ingredient Backlash Risks Spillover to Active Skincare Category', brand: 'La Roche-Posay / CeraVe / Vichy', market: 'Global', severity: 'High',
    why: 'Korean beauty brands promoting spicule-based exfoliation are generating viral TikTok content showing extreme skin reactions. Consumer backlash is creating broader hesitation around "clinical-strength" and "active" skincare ingredients, which could affect La Roche-Posay Retinol B3 and CeraVe SA Smoothing ranges.',
    response: 'Monitor spicule sentiment closely. Prepare proactive safety communication for La Roche-Posay and CeraVe active ranges. Engage dermatology KOLs to distinguish proven actives from unregulated trends.',
    scenarioId: 's8',
    detailSections: [
      { label: 'What Changed', content: 'Multiple Korean beauty brands (notably Abib and Medicube) are promoting spicule-based skincare that causes visible peeling. TikTok creators are amplifying extreme skin reactions without context, generating 85M+ views. Consumer sentiment is turning against "strong actives" broadly.' },
      { label: 'Consumer Sentiment', content: '"Spicule skincare reaction" and "spicule burn" are trending queries globally. Viral TikTok videos from @dermdoctor and @skincarebyhyram have called out safety concerns. The backlash is creating spillover hesitation toward retinol, AHA/BHA, and other proven active ingredients.' },
      { label: 'Portfolio Implications', content: 'La Roche-Posay Retinol B3 Serum, CeraVe SA Smoothing Cleanser, and Vichy LiftActiv Retinol ranges could face consumer hesitation if "active ingredients = irritation" narrative broadens. No L\'Oréal portfolio brand uses spicules, but the association risk is real.' },
      { label: 'What Teams Should Do', content: 'Monitor spicule sentiment across all markets. Prepare proactive safety communication distinguishing dermatologist-recommended actives (retinol, niacinamide, salicylic acid) from unregulated trends. Engage dermatology KOLs to reinforce La Roche-Posay and CeraVe safety credentials.' },
    ],
    relatedActions: [
      { action: 'Establish spicule sentiment monitoring for La Roche-Posay and CeraVe', priority: 'High', owner: 'Social Listening Team', rationale: 'Early warning if anti-active narrative spreads to retinol or salicylic acid products' },
      { action: 'Prepare proactive ingredient safety communication for active ranges', priority: 'Medium', owner: 'Corporate Communications', rationale: 'Ready-to-deploy messaging distinguishing proven actives from unregulated trends' },
      { action: 'Engage dermatology KOLs to reinforce active ingredient safety', priority: 'Medium', owner: 'Medical Affairs', rationale: 'Authoritative voices can counter uninformed creator content and protect portfolio positioning' },
    ],
  },
]

// ── Recommended Actions ──
export const SEEDED_ACTIONS: SeededAction[] = [
  { title: 'Issue updated retinol usage guidance in France', priority: 'Critical', owner: 'Medical Affairs France', impact: 'Prevents consumer perception crisis around La Roche-Posay and Vichy retinol safety before French media amplification', timeline: 'Immediate', scenarioId: 's4' },
  { title: 'Accelerate UK Revitalift Clinical Vitamin C launch vs The Ordinary', priority: 'Critical', owner: 'Brand Management UK', impact: 'Prevents The Ordinary (Estée Lauder) from solidifying category ownership in UK brightening serums', timeline: '3-4 weeks', scenarioId: 's2' },
  { title: 'Commission scalp-care consumer research in Southeast Asia', priority: 'High', owner: 'Consumer Insights APAC', impact: 'Validates market sizing for Garnier/Kerastase peptide scalp-care opportunity before product development', timeline: '6-8 weeks', scenarioId: 's1' },
  { title: 'Conduct rapid UX audit for Elvive Bond Repair on Douglas.de', priority: 'High', owner: 'Digital Commerce Germany', impact: 'Addresses low conversion vs Olaplex No.3 despite healthy traffic on German e-commerce', timeline: '2 weeks', scenarioId: 's3' },
  { title: 'Reposition peptide eye-care launch vs Estée Lauder ANR Eye', priority: 'High', owner: 'Brand Strategy', impact: 'Ensures differentiation against Estée Lauder and Shiseido in crowded peptide eye-care market', timeline: 'Before launch', scenarioId: 's7' },
  { title: 'Evaluate exosome technology for Lancome Genifique pipeline', priority: 'High', owner: 'R&D Skincare Innovation', impact: 'First global luxury brand to market with exosome positioning defines the category ahead of Sulwhasoo and AmorePacific', timeline: 'Q3 2026 review', scenarioId: 's5' },
  { title: 'Evaluate ectoin formulation for La Roche-Posay Toleriane range', priority: 'Medium', owner: 'R&D Active Cosmetics', impact: 'Leverages existing barrier-care positioning with next-gen ingredient ahead of Bioderma and Avène', timeline: '12-18 months', scenarioId: 's6' },
  { title: 'Develop copper peptide integration for Helena Rubinstein Prodigy', priority: 'Medium', owner: 'R&D Premium Skincare', impact: 'Captures longevity positioning in premium anti-aging before La Prairie and Sisley', timeline: '2027 pipeline', scenarioId: 's9' },
]

// ── Recent Analyses ──
export const SEEDED_ANALYSES: SeededAnalysis[] = [
  { id: 'sa1', title: 'Peptide Scalp-Care Opportunity Assessment', brand: 'Garnier / Kerastase', market: 'Southeast Asia', signalTypes: ['Opportunity', 'Consumer Insight'], summary: 'Identified emerging peptide scalp-care whitespace in Southeast Asia with no category leader. Consumer demand is driven by preventive wellness behaviour among 18-34 demographic.', timestamp: '2026-03-24T08:45:00Z', scenarioId: 's1' },
  { id: 'sa2', title: 'The Ordinary Vitamin C Competitive Response for UK', brand: "L'Oreal Paris", market: 'United Kingdom', signalTypes: ['Competitive', 'Launch'], summary: 'The Ordinary (Estée Lauder / DECIEM) has captured early SOV in UK brightening serums with Vitamin C Suspension 23%. Recommended accelerating Revitalift Clinical launch and activating clinical data counter-narrative.', timestamp: '2026-03-23T14:20:00Z', scenarioId: 's2' },
  { id: 'sa3', title: 'Elvive Bond Repair vs Olaplex Performance Review', brand: "L'Oreal Paris Elvive", market: 'Germany', signalTypes: ['Launch', 'Performance'], summary: 'Elvive Bond Repair underperforming vs Olaplex No.3 in German e-commerce on Douglas.de and dm.de. Root causes: weak benefit differentiation, insufficient creator support, unexploited price advantage.', timestamp: '2026-03-22T16:10:00Z', scenarioId: 's3' },
  { id: 'sa4', title: 'France Retinol Irritation Sentiment Analysis', brand: 'La Roche-Posay / Vichy', market: 'France', signalTypes: ['Claims', 'Reputation'], summary: 'Rising negative sentiment around retinol irritation in France affecting La Roche-Posay Retinol B3 and Vichy LiftActiv Retinol. No safety signal confirmed, but consumer perception requires proactive management.', timestamp: '2026-03-22T11:30:00Z', scenarioId: 's4' },
  { id: 'sa5', title: 'Exosome Skincare Strategic Assessment', brand: 'Lancome / Helena Rubinstein', market: 'Global Premium', signalTypes: ['Opportunity', 'Innovation'], summary: 'Exosome technology represents the next frontier in biotech beauty. South Korean brands (AmorePacific, Sulwhasoo) are first to market but in clinical channels only. Recommended evaluating Lancome Genifique pipeline integration.', timestamp: '2026-03-21T09:00:00Z', scenarioId: 's5' },
  { id: 'sa6', title: 'Peptide Eye-Care Crowding by Estée Lauder and Shiseido', brand: "L'Oreal Paris / Lancome", market: 'Global', signalTypes: ['Launch', 'Competitive'], summary: 'Peptide eye-care category experiencing narrative crowding from Estée Lauder ANR Eye, Shiseido Benefiance, and Drunk Elephant C-Tango. Recommended repositioning toward proprietary Pro-Retinol + Peptide technology.', timestamp: '2026-03-20T15:30:00Z', scenarioId: 's7' },
]

// ── Derive dynamic intelligence from real analyses ──

export function deriveFromAnalyses(analyses: AnalysisItem[]) {
  const signals: SeededSignal[] = []
  const actions: SeededAction[] = []
  const opportunities: SeededOpportunity[] = []
  const risks: SeededRisk[] = []
  const alerts: SeededAlert[] = []
  const recentAnalyses: SeededAnalysis[] = []

  for (const a of analyses) {
    const types = Array.isArray(a.signal_types) ? a.signal_types.map(t => (t || '').toLowerCase()) : []
    const specialists = Array.isArray(a.specialist_outputs) ? a.specialist_outputs : []
    const pActions = Array.isArray(a.priority_actions) ? a.priority_actions : []
    const summary = a.orchestrator_summary || ''
    const id = a._id || ''

    recentAnalyses.push({
      id, title: cleanText(summary, 60) || 'Web Analysis', brand: 'L\'Oréal', market: 'Global', signalTypes: Array.isArray(a.signal_types) ? a.signal_types : [], summary: cleanText(summary, 200), timestamp: a.createdAt || '', scenarioId: id,
    })

    for (const sp of specialists) {
      const recs = Array.isArray(sp?.recommendations) ? sp.recommendations : []
      const topRec = recs[0]
      const findings = sp?.key_findings || sp?.findings || sp?.analysis || sp?.summary || ''
      const domain = (sp?.domain || sp?.category || sp?.area || '').toLowerCase()
      const spTitle = sp?.title || sp?.signal || cleanText(findings, 70)
      const spBrand = sp?.brand || sp?.brands || 'L\'Oréal'
      const spMarket = sp?.market || sp?.region || sp?.geography || 'Global'
      const urg = recs.some((r: any) => (r?.priority || '').toLowerCase() === 'critical') ? 'Critical'
        : recs.some((r: any) => (r?.priority || '').toLowerCase() === 'high') ? 'High' : 'Medium'

      const relActions = recs.map((r: any) => ({
        action: r?.action || r?.recommendation || '',
        priority: r?.priority || r?.urgency || 'Medium',
        owner: r?.owner || r?.team || 'Cross-functional',
        rationale: r?.rationale || r?.reason || ''
      }))

      // Always create a signal from each specialist output
      signals.push({
        id, title: cleanText(spTitle, 70), brand: spBrand, market: spMarket, urgency: urg,
        why: findings, nextStep: topRec?.action || topRec?.recommendation || 'Review full analysis',
        crossCutting: a.cross_cutting_themes || '', timestamp: a.createdAt || '',
        detailSections: [
          { label: 'Key Findings', content: findings },
          { label: 'Recommended Action', content: topRec?.action || topRec?.recommendation || 'See full analysis' },
          ...(sp?.data_points ? [{ label: 'Supporting Data', content: Array.isArray(sp.data_points) ? sp.data_points.join('; ') : String(sp.data_points) }] : []),
        ],
        relatedActions: relActions,
      })

      // Map to opportunities — broad keyword matching
      const isOpp = types.includes('opportunity') || domain.includes('opportunity') || domain.includes('market')
        || domain.includes('trend') || domain.includes('ingredient') || domain.includes('innovation')
        || domain.includes('whitespace') || domain.includes('consumer') || domain.includes('growth')
        || findings.toLowerCase().includes('opportunity') || findings.toLowerCase().includes('emerging')
      if (isOpp) {
        opportunities.push({
          title: cleanText(spTitle, 70), brand: spBrand, market: spMarket,
          why: findings, confidence: sp?.confidence || urg, move: topRec?.action || topRec?.recommendation || '',
          scenarioId: id,
          detailSections: [{ label: 'Opportunity Analysis', content: findings }, ...(recs.length > 1 ? [{ label: 'Next Steps', content: recs.map((r: any) => r?.action || r?.recommendation || '').filter(Boolean).join('. ') }] : [])],
          relatedActions: relActions,
        })
      }

      // Map to risks — broad keyword matching
      const isRisk = types.includes('launch') || types.includes('risk') || domain.includes('launch')
        || domain.includes('performance') || domain.includes('competitor') || domain.includes('competitive')
        || domain.includes('risk') || domain.includes('threat')
        || findings.toLowerCase().includes('risk') || findings.toLowerCase().includes('underperform')
        || findings.toLowerCase().includes('competitor')
      if (isRisk) {
        risks.push({
          title: cleanText(spTitle, 70), brand: spBrand, market: spMarket, severity: urg,
          cause: findings, action: topRec?.action || topRec?.recommendation || '',
          scenarioId: id,
          detailSections: [{ label: 'Risk Analysis', content: findings }, ...(recs.length > 1 ? [{ label: 'Mitigation Steps', content: recs.map((r: any) => r?.action || r?.recommendation || '').filter(Boolean).join('. ') }] : [])],
          relatedActions: relActions,
        })
      }

      // Map to alerts — broad keyword matching
      const isAlert = types.includes('claims') || types.includes('reputation') || types.includes('safety')
        || domain.includes('claims') || domain.includes('compliance') || domain.includes('reputation')
        || domain.includes('integrity') || domain.includes('safety') || domain.includes('regulatory')
        || domain.includes('sentiment')
        || findings.toLowerCase().includes('concern') || findings.toLowerCase().includes('irritation')
        || findings.toLowerCase().includes('safety') || findings.toLowerCase().includes('regulatory')
      if (isAlert) {
        alerts.push({
          title: cleanText(spTitle, 70), brand: spBrand, market: spMarket, severity: urg,
          why: findings, response: topRec?.action || topRec?.recommendation || '',
          scenarioId: id,
          detailSections: [{ label: 'Alert Analysis', content: findings }, ...(recs.length > 1 ? [{ label: 'Response Plan', content: recs.map((r: any) => r?.action || r?.recommendation || '').filter(Boolean).join('. ') }] : [])],
          relatedActions: relActions,
        })
      }

      // If no category matched, add to opportunities as default (web data is usually opportunity-oriented)
      if (!isOpp && !isRisk && !isAlert) {
        opportunities.push({
          title: cleanText(spTitle, 70), brand: spBrand, market: spMarket,
          why: findings, confidence: 'Medium', move: topRec?.action || topRec?.recommendation || '',
          scenarioId: id,
          detailSections: [{ label: 'Analysis', content: findings }],
          relatedActions: relActions,
        })
      }
    }

    for (const pa of pActions) {
      actions.push({
        title: pa?.action || pa?.recommendation || pa?.title || '',
        priority: pa?.priority || pa?.urgency || 'Medium',
        owner: pa?.owner || pa?.team || 'Cross-functional',
        impact: pa?.impact || pa?.rationale || cleanText(summary, 120),
        timeline: pa?.timeline || pa?.timeframe || 'Per analysis',
        scenarioId: id,
      })
    }
  }

  signals.sort((a, b) => priorityOrder(a.urgency) - priorityOrder(b.urgency))
  actions.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority))
  opportunities.sort((a, b) => priorityOrder(a.confidence) - priorityOrder(b.confidence))
  risks.sort((a, b) => priorityOrder(a.severity) - priorityOrder(b.severity))
  alerts.sort((a, b) => priorityOrder(a.severity) - priorityOrder(b.severity))
  return { signals, actions, opportunities, risks, alerts, recentAnalyses }
}
