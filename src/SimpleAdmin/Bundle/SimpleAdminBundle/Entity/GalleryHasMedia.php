<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Entity;

use Sonata\MediaBundle\Entity\BaseGalleryHasMedia as BaseGalleryHasMedia;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class GalleryHasMedia extends BaseGalleryHasMedia
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var integer $id
     */
    protected $id;

    /**
     * Get id
     *
     * @return integer $id
     */
    public function getId()
    {
        return $this->id;
    }
}
