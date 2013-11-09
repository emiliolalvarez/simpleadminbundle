<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Entity;

use Sonata\MediaBundle\Entity\BaseMedia as BaseMedia;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class Media extends BaseMedia
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
