<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('simple_admin');
        $rootNode
            ->children()
                ->arrayNode('manage')
                    ->isRequired()
                    ->children()
                        ->arrayNode('entities')
                            #->requiresAtLeastOneElement()
                            /*->prototype('scalar')
                                ->defaultValue(array())
                            ->end()*/
                            ->prototype('array')
                                ->children()
                                    ->scalarNode('name')->defaultValue('')->end()
                                    ->scalarNode('entity')->defaultValue('')->end()
                                    ->arrayNode('children')
                                        ->prototype('array')
                                            ->children()
                                                ->scalarNode('name')->defaultValue('')->end()
                                                ->scalarNode('entity')->defaultValue('')->end()
                                            ->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('columns')
                                        ->prototype('array')
                                            ->children()
                                                ->scalarNode('field')->defaultValue('')->end()
                                                ->scalarNode('alias')->defaultValue('')->end()
                                            ->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('filters')
                                      ->prototype('array')
                                        ->children()
                                          ->scalarNode('field')->defaultValue('')->end()
                                          ->scalarNode('type')->defaultValue('')->end()
                                          ->scalarNode('label')->defaultValue('')->end()
                                          ->scalarNode('entity')->defaultValue('')->end()
                                        ->end()
                                      ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        return $treeBuilder;
    }


}
