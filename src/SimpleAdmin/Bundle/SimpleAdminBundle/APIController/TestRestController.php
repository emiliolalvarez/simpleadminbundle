<?php
namespace SimpleAdmin\Bundle\SimpleAdminBundle\APIController;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use JMS\SecurityExtraBundle\Annotation\Secure;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
* @Rest\NamePrefix("api_")
*/
class TestRestController extends Controller{
    /**
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getInfoTestRestAction(Request $request){
        $user = new \SimpleAdmin\Bundle\SimpleAdminBundle\Entity\User();
        $user->setEmail('test@test.com');
        return $user;
    }

}