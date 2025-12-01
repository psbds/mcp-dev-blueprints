import type {
    ServerFeature as IndexServerFeature,
    ToolDefinition as IndexToolDefinition,
    ResourceDefinition as IndexResourceDefinition,
    PromptDefinition as IndexPromptDefinition
} from '../../src/features/index.js';
import type {
    ServerFeature as TypesServerFeature,
    ToolDefinition as TypesToolDefinition,
    ResourceDefinition as TypesResourceDefinition,
    PromptDefinition as TypesPromptDefinition
} from '../../src/features/types.js';



describe('features/index', () => {
    describe('exported functions', () => {
        it('should re-export all custom registration functions from custom module', async () => {
            // Arrange
            const indexModule = await import('../../src/features/index.js');
            const customModule = await import('../../src/features/custom.js');

            // Assert
            expect(indexModule.registerCustomTool).toBeDefined();
            expect(typeof indexModule.registerCustomTool).toBe('function');
            expect(indexModule.registerCustomTool).toBe(customModule.registerCustomTool);

            expect(indexModule.registerCustomPrompt).toBeDefined();
            expect(typeof indexModule.registerCustomPrompt).toBe('function');
            expect(indexModule.registerCustomPrompt).toBe(customModule.registerCustomPrompt);

            expect(indexModule.registerCustomResource).toBeDefined();
            expect(typeof indexModule.registerCustomResource).toBe('function');
            expect(indexModule.registerCustomResource).toBe(customModule.registerCustomResource);
        });
    });

    describe('exported types', () => {
        it('should re-export all type definitions from types module', () => {
            // Arrange
            type AssertServerFeature = IndexServerFeature extends TypesServerFeature ? TypesServerFeature extends IndexServerFeature ? true : false : false;
            type AssertToolDefinition = IndexToolDefinition extends TypesToolDefinition ? TypesToolDefinition extends IndexToolDefinition ? true : false : false;
            type AssertResourceDefinition = IndexResourceDefinition extends TypesResourceDefinition ? TypesResourceDefinition extends IndexResourceDefinition ? true : false : false;
            type AssertPromptDefinition = IndexPromptDefinition extends TypesPromptDefinition ? TypesPromptDefinition extends IndexPromptDefinition ? true : false : false;

            const assertServerFeature: AssertServerFeature = true;
            const assertToolDefinition: AssertToolDefinition = true;
            const assertResourceDefinition: AssertResourceDefinition = true;
            const assertPromptDefinition: AssertPromptDefinition = true;
            
            // Assert

            // Verify ServerFeature is properly re-exported
            expect(assertServerFeature).toBe(true);

            // Verify ToolDefinition is properly re-exported
            expect(assertToolDefinition).toBe(true);

            // Verify ResourceDefinition is properly re-exported
            expect(assertResourceDefinition).toBe(true);

            // Verify PromptDefinition is properly re-exported
            expect(assertPromptDefinition).toBe(true);
        });
    });
});
