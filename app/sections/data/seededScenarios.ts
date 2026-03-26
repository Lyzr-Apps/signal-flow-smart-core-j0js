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
    why: 'Search volume for "peptide scalp serum" is up 280% QoQ in SEA. Social discussion centres on scalp barrier health among 18-34 consumers. Current offerings are fragmented with no category leader.',
    nextStep: 'Commission consumer research in Indonesia and Thailand to validate demand sizing and price sensitivity',
    crossCutting: 'Preventive hair wellness is an emerging behaviour shift that connects scalp health, active ingredients, and self-care culture.',
    timestamp: '2026-03-24T08:45:00Z',
    detailSections: [
      { label: 'Signal Context', content: 'Search and social discussion around scalp barrier health and peptide-based scalp serums is rising in Southeast Asia, especially among younger consumers seeking preventive hair wellness routines. Current offerings are fragmented and education is still limited.' },
      { label: 'Why It Matters', content: 'This represents a whitespace opportunity where no major brand owns the category narrative. Consumer behaviour is shifting from reactive hair repair to preventive scalp wellness, and peptide-based formulations are the emerging science story driving interest.' },
      { label: 'Market Intelligence', content: 'Google Trends data shows "scalp serum" search volume up 280% QoQ in Indonesia, Philippines, and Thailand. TikTok and Instagram Reels content around scalp-care routines is generating 3-5x higher engagement than traditional hair-care content.' },
      { label: 'Recommended Next Step', content: 'Commission consumer research in Indonesia and Thailand to validate demand sizing and price sensitivity. Evaluate existing Kerastase and Garnier scalp-care formulations for SEA market adaptation.' },
    ],
    relatedActions: [
      { action: 'Commission scalp-care consumer research in SEA', priority: 'High', owner: 'Consumer Insights APAC', rationale: 'Validate market size and consumer willingness to pay before product development' },
      { action: 'Evaluate peptide scalp serum formulation pipeline', priority: 'High', owner: 'R&D Hair Care', rationale: 'Determine time-to-market for peptide-based scalp product' },
      { action: 'Map competitive landscape in SEA scalp-care', priority: 'Medium', owner: 'Strategy APAC', rationale: 'Identify gaps and positioning opportunities before committing resources' },
    ],
  },
  {
    id: 's2', title: 'Competitor Capturing Early SOV in UK Brightening Serums', brand: "L'Oreal Paris", market: 'United Kingdom', urgency: 'Critical',
    why: 'A competitor has launched a vitamin C brightening serum with strong creator seeding and dermatologist endorsements ahead of our planned Q2 activation. Our share of voice has dropped 18 points in 4 weeks.',
    nextStep: 'Accelerate UK brightening serum launch timeline and activate counter-narrative with owned clinical data',
    crossCutting: 'Speed of competitive response in creator-led categories determines long-term SOV positioning.',
    timestamp: '2026-03-23T14:20:00Z',
    detailSections: [
      { label: 'Signal Context', content: 'A competitor has launched a vitamin C brightening serum in the UK with strong creator seeding, dermatologist-led content, and retail placement ahead of our planned activation. Search and social attention are consolidating around the competitor claims.' },
      { label: 'Competitive Threat Assessment', content: 'Competitor SOV in "brightening serum UK" search cluster has risen from 12% to 38% in 4 weeks. Their creator programme includes 40+ dermatology and skincare influencers. Retail placement includes Boots premium endcap and Space NK feature wall.' },
      { label: 'Impact on L\'Oreal Paris', content: 'Our planned Q2 UK brightening serum launch is at risk of entering a market where competitor claims are already established. Without counter-positioning, our launch will appear reactive rather than innovative.' },
      { label: 'Recommended Response', content: 'Accelerate UK launch timeline by 3-4 weeks. Activate proprietary clinical trial data as a differentiation lever. Engage UK-based dermatologists for counter-narrative content before competitor narrative solidifies.' },
    ],
    relatedActions: [
      { action: 'Accelerate UK brightening serum launch by 3-4 weeks', priority: 'Critical', owner: 'Brand Management UK', rationale: 'Prevent competitor from solidifying category ownership' },
      { action: 'Activate clinical data counter-narrative programme', priority: 'Critical', owner: 'Medical Affairs / PR', rationale: 'Differentiate on clinical evidence vs. competitor creator-led claims' },
      { action: 'Secure Boots premium placement for launch week', priority: 'High', owner: 'Commercial UK', rationale: 'Match competitor retail visibility' },
    ],
  },
  {
    id: 's5', title: 'Exosome Skincare Interest Accelerating in Premium Anti-Aging', brand: 'Lancome / Helena Rubinstein', market: 'South Korea / US / Europe', urgency: 'High',
    why: 'Search and creator discussion around exosome-based skincare is accelerating among premium consumers. The narrative centres on advanced repair and regeneration, but consumer understanding is early and fragmented.',
    nextStep: 'Evaluate exosome technology integration into Lancome Advanced Genifique pipeline and commission regulatory feasibility review',
    crossCutting: 'Exosome technology bridges biotech and beauty in ways that could redefine premium anti-aging positioning.',
    timestamp: '2026-03-22T11:30:00Z',
    detailSections: [
      { label: 'Signal Context', content: 'Search, social, and creator discussion around exosome-based skincare is accelerating among premium skincare consumers, especially in South Korea, the US, and selective European markets.' },
      { label: 'Opportunity Assessment', content: 'Exosome skincare represents the next frontier in biotech beauty. South Korean brands are first to market but primarily in clinical channels. No global luxury brand has claimed the exosome narrative in mainstream premium skincare.' },
      { label: 'Strategic Fit', content: 'Lancome Advanced Genifique and Helena Rubinstein Prodigy lines are well positioned to integrate exosome technology. Both brands have established science-led positioning that would benefit from next-generation biotech ingredients.' },
      { label: 'Recommended Next Step', content: 'Evaluate exosome technology integration into Advanced Genifique pipeline. Commission regulatory feasibility review for EU, US, and China markets. Begin science communication groundwork with key dermatology KOLs.' },
    ],
    relatedActions: [
      { action: 'Evaluate exosome technology for Genifique pipeline', priority: 'High', owner: 'R&D Skincare Innovation', rationale: 'First global luxury brand to market with exosome claims will define category' },
      { action: 'Commission multi-market regulatory feasibility review', priority: 'High', owner: 'Regulatory Affairs', rationale: 'Exosome claims require careful navigation across regulatory frameworks' },
      { action: 'Begin KOL science communication programme', priority: 'Medium', owner: 'Medical Affairs', rationale: 'Build credibility infrastructure before product launch' },
    ],
  },
]

// ── Active Opportunities ──
export const SEEDED_OPPORTUNITIES: SeededOpportunity[] = [
  {
    title: 'Peptide Scalp-Care Category Leadership in SEA', brand: 'Garnier / Kerastase', market: 'Southeast Asia', confidence: 'High',
    why: 'No category leader exists in peptide scalp-care in SEA. Consumer search and social signals show strong and growing demand. The preventive hair wellness positioning aligns with regional self-care trends among 18-34 consumers.',
    move: 'Fast-track peptide scalp serum development with SEA-specific formulation. Target Q4 2026 launch in Indonesia and Thailand with creator-led education campaign.',
    scenarioId: 's1',
    detailSections: [
      { label: 'Opportunity Overview', content: 'Peptide scalp-care is an emerging category with no established leader in Southeast Asia. Consumer interest is driven by the shift from reactive hair repair to preventive scalp wellness.' },
      { label: 'Market Sizing', content: 'The SEA scalp-care market is estimated at $340M and growing at 18% CAGR. Peptide-based products represent less than 5% of current offerings, indicating significant upside.' },
      { label: 'Competitive Landscape', content: 'Current offerings are fragmented across local brands and K-beauty imports. No global brand has established a dominant position. Kerastase has existing scalp-care credibility that can be leveraged.' },
    ],
    relatedActions: [
      { action: 'Fast-track peptide scalp serum for SEA', priority: 'High', owner: 'R&D Hair Care', rationale: 'First-mover advantage in category with no established leader' },
      { action: 'Develop creator-led scalp education campaign', priority: 'High', owner: 'Digital Marketing APAC', rationale: 'Education is key; consumers are interested but knowledge is limited' },
    ],
  },
  {
    title: 'Ectoin Barrier-Support Positioning in Sensitive Skincare', brand: 'La Roche-Posay / CeraVe', market: 'Global', confidence: 'Medium',
    why: 'Consumer and creator interest in ectoin is rising as barrier-repair remains important. La Roche-Posay and CeraVe have strong barrier-care positioning to leverage.',
    move: 'Develop ectoin-enhanced formulation for existing barrier-care ranges. Position as next-generation ingredient story within established product lines.',
    scenarioId: 's6',
    detailSections: [
      { label: 'Opportunity Overview', content: 'Ectoin is gaining traction as a barrier-support ingredient with rising consumer and creator interest in calming and environmental stress defense.' },
      { label: 'Strategic Fit', content: 'La Roche-Posay Toleriane and CeraVe barrier ranges are natural homes for ectoin integration. Both brands have credibility in dermatologist-recommended skincare.' },
      { label: 'Competitive Window', content: 'Ectoin awareness is still early. Two indie brands have launched ectoin products but lack the distribution and credibility of L\'Oreal portfolio brands. Window is 12-18 months.' },
    ],
    relatedActions: [
      { action: 'Evaluate ectoin formulation for Toleriane range', priority: 'Medium', owner: 'R&D Active Cosmetics', rationale: 'Leverage existing barrier-care positioning with next-gen ingredient' },
      { action: 'Develop ectoin ingredient education content', priority: 'Medium', owner: 'Medical Marketing', rationale: 'Build consumer understanding before competitor narrative forms' },
    ],
  },
  {
    title: 'Copper Peptide Longevity Positioning in Premium Skincare', brand: 'Helena Rubinstein / Lancome', market: 'Global Premium', confidence: 'Medium',
    why: 'Copper peptides are re-emerging in premium conversations linked to skin longevity and healthy aging. The framing is becoming more sophisticated and science-led.',
    move: 'Develop copper peptide integration roadmap for Helena Rubinstein Prodigy line. Position as longevity-science ingredient rather than traditional repair.',
    scenarioId: 's9',
    detailSections: [
      { label: 'Opportunity Overview', content: 'Copper peptides are reappearing in premium skincare conversations, now linked to skin longevity and healthy aging narratives beyond traditional repair.' },
      { label: 'Consumer Insight', content: 'Premium skincare consumers aged 35-55 are increasingly interested in longevity-positioned products. Copper peptides offer a credible science story.' },
      { label: 'Competitive Landscape', content: 'No major luxury brand has claimed copper peptides in a longevity context. Several indie brands are experimenting but lack the R&D depth to scale.' },
    ],
    relatedActions: [
      { action: 'Develop copper peptide integration for Prodigy line', priority: 'Medium', owner: 'R&D Premium Skincare', rationale: 'Leverage longevity trend with credible science-backed ingredient' },
      { action: 'Commission longevity positioning research', priority: 'Low', owner: 'Consumer Insights', rationale: 'Validate longevity framing resonance with target consumers' },
    ],
  },
]

// ── Launch Risks ──
export const SEEDED_RISKS: SeededRisk[] = [
  {
    title: 'Hair Repair Launch Underperforming in Germany E-Commerce', brand: "L'Oreal Paris Hair", market: 'Germany', severity: 'High',
    cause: 'Product page traffic is healthy but conversion is low. Reviews show confusion around benefit differentiation vs. existing repair products. Creator support is limited.',
    action: 'Conduct rapid UX audit of product page. Rebrief creator programme with clearer benefit messaging. Test A/B product page copy.',
    scenarioId: 's3',
    detailSections: [
      { label: 'Risk Context', content: 'A newly launched hair repair product is seeing weaker-than-expected traction in Germany. Product page traffic is healthy, but conversion is low and creator support is limited.' },
      { label: 'Performance Data', content: 'Product page visits at 85% of target, but add-to-cart rate is 2.1% vs. 4.8% benchmark. Early reviews (62 total) show 3.2/5 average rating with recurring themes of "not sure how this is different." Creator content volume at 30% of plan.' },
      { label: 'Root Cause Assessment', content: 'Three contributing factors: (1) Benefit messaging does not clearly differentiate from existing repair range, (2) Creator briefs were generic, (3) Price point creates expectation gap.' },
      { label: 'Recommended Response', content: 'Conduct rapid UX audit of product page. Rebrief creator programme with clearer differentiation messaging. Consider limited-time trial pricing to drive initial conversion.' },
    ],
    relatedActions: [
      { action: 'Conduct rapid e-commerce UX audit', priority: 'High', owner: 'Digital Commerce Germany', rationale: 'Low conversion despite healthy traffic indicates product page issues' },
      { action: 'Rebrief creator programme with differentiation messaging', priority: 'High', owner: 'Influencer Marketing', rationale: 'Current creator content lacks benefit clarity' },
      { action: 'Test A/B product page copy variations', priority: 'Medium', owner: 'E-Commerce Team', rationale: 'Validate which benefit messaging drives conversion' },
    ],
  },
  {
    title: 'Peptide Eye-Care Launch Facing Narrative Crowding', brand: "L'Oreal Paris / Lancome", market: 'Global', severity: 'High',
    cause: 'Competitor brands have intensified messaging around collagen support using overlapping peptide language. Early social content suggests category crowding and weak differentiation.',
    action: 'Reposition launch messaging away from generic peptide claims toward proprietary technology narrative. Delay launch by 2-3 weeks to refine creative.',
    scenarioId: 's7',
    detailSections: [
      { label: 'Risk Context', content: 'L\'Oreal is preparing to launch a peptide eye-care product, but competitor brands have already intensified messaging with overlapping peptide language. Category is getting crowded.' },
      { label: 'Competitive Noise Assessment', content: 'In the past 8 weeks, three competitor brands have launched or announced peptide eye-care products. Total social mentions of "peptide eye cream" are up 420%, but sentiment shows growing consumer confusion.' },
      { label: 'Differentiation Gap', content: 'Current launch messaging relies on "peptide complex for eye area" which overlaps with competitor claims. Internal clinical data shows superior results on dark circles and puffiness, but this is not in planned comms.' },
      { label: 'Recommended Response', content: 'Reposition launch messaging toward proprietary technology narrative. Leverage clinical data on dark circles and puffiness as differentiation. Consider delaying launch by 2-3 weeks.' },
    ],
    relatedActions: [
      { action: 'Reposition peptide eye-care launch messaging', priority: 'High', owner: 'Brand Strategy', rationale: 'Generic peptide claims will not cut through current competitive noise' },
      { action: 'Activate clinical differentiation data in launch comms', priority: 'High', owner: 'Medical Affairs / PR', rationale: 'Proprietary clinical results are the strongest differentiation lever' },
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
      { label: 'Alert Context', content: 'Review and social chatter in France show rising concern around irritation and improper use of a retinol product. Consumer interpretation is turning negative.' },
      { label: 'Sentiment Analysis', content: 'Negative sentiment around retinol irritation has increased 340% in French social channels over 6 weeks. Key themes: "too strong for daily use," "burned my skin." 23% of recent reviews mention irritation.' },
      { label: 'Risk Assessment', content: 'While no pharmacovigilance signal is confirmed, the consumer perception risk is significant. If a French media outlet picks up the narrative, it could impact the broader retinol portfolio.' },
      { label: 'Recommended Response', content: 'Issue updated usage guidance with dermatologist-backed content. Proactively address concerns through owned social channels. Brief customer service teams. Monitor for escalation.' },
    ],
    relatedActions: [
      { action: 'Issue updated retinol usage guidance in France', priority: 'Critical', owner: 'Medical Affairs France', rationale: 'Proactive education is essential before narrative escalates' },
      { action: 'Activate dermatologist-backed content on owned channels', priority: 'Critical', owner: 'Digital Marketing France', rationale: 'Counter negative UGC with authoritative guidance' },
      { action: 'Brief customer service teams on retinol talking points', priority: 'High', owner: 'Consumer Relations', rationale: 'Ensure consistent and reassuring response to inquiries' },
    ],
  },
  {
    title: 'Spicule Ingredient Concern Creating Consumer Hesitation', brand: 'Cross-brand / Market-wide', market: 'Global', severity: 'High',
    why: 'Social discussion around spicule-based skincare is growing, but concerns about irritation, overuse, and safety are intensifying. Some creators are amplifying strong visible reactions without education.',
    response: 'Monitor spicule sentiment closely. Prepare proactive safety communication. Engage dermatology KOLs to provide balanced perspective.',
    scenarioId: 's8',
    detailSections: [
      { label: 'Alert Context', content: 'Social discussion around spicule-based skincare is growing alongside concerns about irritation and safety. Creators are amplifying strong reactions without nuance.' },
      { label: 'Consumer Sentiment', content: 'Spicule content generates high engagement but increasingly polarised sentiment. "Spicule skincare reaction" and "spicule burn" are trending queries. Viral videos show extreme reactions without proper context.' },
      { label: 'Portfolio Implications', content: 'Even without spicule ingredients, the narrative could affect consumer confidence in "active" or "clinical-strength" skincare ingredients across the portfolio.' },
      { label: 'Recommended Response', content: 'Monitor spicule sentiment across markets. Prepare proactive safety communication framework. Engage dermatology KOLs for balanced perspective on ingredient safety.' },
    ],
    relatedActions: [
      { action: 'Establish spicule sentiment monitoring dashboard', priority: 'High', owner: 'Social Listening Team', rationale: 'Early warning if narrative spreads to adjacent ingredients' },
      { action: 'Prepare proactive ingredient safety communication', priority: 'Medium', owner: 'Corporate Communications', rationale: 'Ready-to-deploy messaging if escalation occurs' },
      { action: 'Engage dermatology KOLs for balanced perspective', priority: 'Medium', owner: 'Medical Affairs', rationale: 'Authoritative voices can counter uninformed creator content' },
    ],
  },
]

// ── Recommended Actions ──
export const SEEDED_ACTIONS: SeededAction[] = [
  { title: 'Issue updated retinol usage guidance in France', priority: 'Critical', owner: 'Medical Affairs France', impact: 'Prevents consumer perception crisis around retinol safety before media amplification', timeline: 'Immediate', scenarioId: 's4' },
  { title: 'Accelerate UK brightening serum launch by 3-4 weeks', priority: 'Critical', owner: 'Brand Management UK', impact: 'Prevents competitor from solidifying category ownership in brightening serums', timeline: '3-4 weeks', scenarioId: 's2' },
  { title: 'Commission scalp-care consumer research in SEA', priority: 'High', owner: 'Consumer Insights APAC', impact: 'Validates market sizing for peptide scalp-care opportunity before product development', timeline: '6-8 weeks', scenarioId: 's1' },
  { title: 'Conduct rapid e-commerce UX audit for Germany hair repair', priority: 'High', owner: 'Digital Commerce Germany', impact: 'Addresses low conversion despite healthy traffic on underperforming launch', timeline: '2 weeks', scenarioId: 's3' },
  { title: 'Reposition peptide eye-care launch messaging', priority: 'High', owner: 'Brand Strategy', impact: 'Ensures differentiation in crowded peptide eye-care narrative', timeline: 'Before launch', scenarioId: 's7' },
  { title: 'Evaluate exosome technology for Genifique pipeline', priority: 'High', owner: 'R&D Skincare Innovation', impact: 'First global luxury brand to market with exosome positioning defines the category', timeline: 'Q3 2026 review', scenarioId: 's5' },
  { title: 'Evaluate ectoin formulation for Toleriane range', priority: 'Medium', owner: 'R&D Active Cosmetics', impact: 'Leverages existing barrier-care positioning with next-gen ingredient story', timeline: '12-18 months', scenarioId: 's6' },
  { title: 'Develop copper peptide integration for Prodigy line', priority: 'Medium', owner: 'R&D Premium Skincare', impact: 'Captures longevity positioning in premium anti-aging before competitors', timeline: '2027 pipeline', scenarioId: 's9' },
]

// ── Recent Analyses ──
export const SEEDED_ANALYSES: SeededAnalysis[] = [
  { id: 'sa1', title: 'Peptide Scalp-Care Opportunity Assessment', brand: 'Garnier / Kerastase', market: 'Southeast Asia', signalTypes: ['Opportunity', 'Consumer Insight'], summary: 'Identified emerging peptide scalp-care whitespace in SEA with no category leader. Consumer demand is driven by preventive wellness behaviour among 18-34 demographic.', timestamp: '2026-03-24T08:45:00Z', scenarioId: 's1' },
  { id: 'sa2', title: 'UK Brightening Serum Competitive Response', brand: "L'Oreal Paris", market: 'United Kingdom', signalTypes: ['Competitive', 'Launch'], summary: 'Competitor has captured early SOV in UK brightening serums. Recommended accelerating launch timeline and activating clinical data counter-narrative.', timestamp: '2026-03-23T14:20:00Z', scenarioId: 's2' },
  { id: 'sa3', title: 'Germany Hair Repair Launch Performance Review', brand: "L'Oreal Paris Hair", market: 'Germany', signalTypes: ['Launch', 'Performance'], summary: 'Hair repair product underperforming in German e-commerce. Root causes: weak benefit differentiation, insufficient creator support, product page messaging gap.', timestamp: '2026-03-22T16:10:00Z', scenarioId: 's3' },
  { id: 'sa4', title: 'France Retinol Irritation Sentiment Analysis', brand: 'La Roche-Posay / Vichy', market: 'France', signalTypes: ['Claims', 'Reputation'], summary: 'Rising negative sentiment around retinol irritation in France. No safety signal confirmed, but consumer perception requires proactive management.', timestamp: '2026-03-22T11:30:00Z', scenarioId: 's4' },
  { id: 'sa5', title: 'Exosome Skincare Strategic Assessment', brand: 'Lancome / Helena Rubinstein', market: 'Global Premium', signalTypes: ['Opportunity', 'Innovation'], summary: 'Exosome technology represents the next frontier in biotech beauty. No global luxury brand has claimed the narrative. Recommended evaluating Genifique pipeline integration.', timestamp: '2026-03-21T09:00:00Z', scenarioId: 's5' },
  { id: 'sa6', title: 'Peptide Eye-Care Launch Positioning Review', brand: "L'Oreal Paris / Lancome", market: 'Global', signalTypes: ['Launch', 'Competitive'], summary: 'Peptide eye-care category experiencing narrative crowding. Three competitor launches in 8 weeks. Recommended repositioning toward proprietary technology narrative.', timestamp: '2026-03-20T15:30:00Z', scenarioId: 's7' },
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
