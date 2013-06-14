<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @param $name
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/test/{name}")
     */
    public function indexAction($name)
    {
        ob_start();
        phpinfo(INFO_MODULES);
        $phpinfo = ob_get_contents();
        ob_end_clean();
        return $this->render('SimpleAdminBundle:Default:index.html.twig', array('name' => $name, 'phpinfo'=>$phpinfo));
    }

    public function defaultAction(Request $request){
        return new Response("Default controller",200);
    }
}