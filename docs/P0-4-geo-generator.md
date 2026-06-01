# P0-4: GEO Content Generator

## Overview

Created the GEO content generator service that automatically generates FAQ, Use Case, Comparison, and Case Study content from an Opportunity.

## File Created

- `/workspace/src/intel/services/geo-generator.ts`

## Core Functions

### `generateGeoContent(opportunity: Opportunity): GeneratedGeoContent`

Generates the complete GEO content matrix including:
- FAQs
- Use Cases
- Comparisons
- Case Studies

### `generateFaqs(opportunity: Opportunity): Question[]`

Generates FAQ questions and answers based on the `geoExpansion.faqTopics` field in the Opportunity.

### `generateUseCases(opportunity: Opportunity): UseCase[]`

Generates use case content based on the `geoExpansion.useCaseTopics` field.

### `generateComparisons(opportunity: Opportunity): Comparison[]`

Generates product comparison content based on the `geoExpansion.comparisonTopics` field.

### `generateCaseStudies(opportunity: Opportunity): CaseStudy[]`

Generates case study content based on the `geoExpansion.caseStudyTopics` field.

### `printGeoCodeSnippets(opportunity: Opportunity): string`

Prints JSON code snippets that can be manually copied and added to the respective data files.

## Usage Example

```typescript
import { OPPORTUNITIES } from '../data/opportunities';
import { generateGeoContent, printGeoCodeSnippets } from '../services/geo-generator';

const opportunity = OPPORTUNITIES[0]; // MarkItDown example
const geoContent = generateGeoContent(opportunity);
const codeSnippets = printGeoCodeSnippets(opportunity);

console.log(codeSnippets);
```

## Data Flow

1. **Input**: An Opportunity object with populated `geoExpansion` field
2. **Processing**: Generates content for each GEO type using helper functions
3. **Output**: Structured content objects matching the existing data schemas

## Key Features

- **Bilingual Support**: Generates both English and Chinese content
- **Type-Safe**: Fully typed to match existing data interfaces
- **Code Snippet Generation**: Outputs ready-to-use JSON for manual insertion
- **Intelligent Type Detection**: Automatically detects FAQ question types (how-to, what-is, etc.)

## Next Steps

- Test with existing Opportunity data
- Integrate with the internal dashboard
- Add more sophisticated content generation logic
