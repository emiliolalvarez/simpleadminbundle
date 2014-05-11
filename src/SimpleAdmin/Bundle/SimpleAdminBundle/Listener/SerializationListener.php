<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\Listener;

use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Tag;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Observe;
use JMS\Serializer\EventDispatcher\EventSubscriberInterface;
use JMS\Serializer\EventDispatcher\ObjectEvent;
use JMS\Serializer\GraphNavigator;
use SimpleAdmin\Bundle\SimpleAdminBundle\Entity\Media;
use Sonata\MediaBundle\Entity\MediaManager;

/**
 * Add data after serialization
 *
 * @Service("simpleadmin.listener.serializationlistener")
 * @Tag("jms_serializer.event_subscriber")
 */
class SerializationListener implements EventSubscriberInterface
{
   /**
     * @var MediaManager $mediaManager
     * @Inject("sonata.media.manager.media",required = true)
     */
    public $mediaManager;

    /**
     * @var MediaManager $mediaManager
     * @Inject("service_container", required = true)
     */
    public $container;

    /**
     * @inheritdoc
     */
    static public function getSubscribedEvents()
    {
        return array(
            array('event' => 'serializer.pre_serialize', 'class' => 'SimpleAdmin\Bundle\SimpleAdminBundle\Entity\Media', 'method' => 'onPreSerialize'),
            array('event' => 'serializer.post_serialize', 'class' => 'SimpleAdmin\Bundle\SimpleAdminBundle\Entity\Media', 'method' => 'onPostSerialize'),
        );
    }


    public function onPreSerialize(ObjectEvent $event){

    }

    public function onPostSerialize(ObjectEvent $event){
        $object = $event->getObject();

        $provider = $this->container->get($object->getProviderName());

        foreach ($provider->getFormats() as  $key => $format) {
            $photo[$key] = $provider->generatePublicUrl($object, $key);
        }

        $event->getVisitor()->addData('imageUri',$photo);

    }
}